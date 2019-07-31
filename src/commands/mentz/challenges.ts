import {core, flags, SfdxCommand} from '@salesforce/command';
import {AnyJson} from '@salesforce/ts-types';
import cli from 'cli-ux';
import { execFileSync } from 'child_process';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('mentz', 'mentz_challenges');

export default class Challenges extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx mentz:challege --targetusername myOrg@example.com 
  Select a challenge

1) COLLECTION SIMPLE 1
0) Quit
Choose a challenge: 1
Chosen = 1
Cloning repository = https://github.com/mentzbb/SimpleCollections1
 ...
Done

`,
  `$ sfdx mentz:publish --targetusername myOrg@example.com --all
  Select a challenge

1) COLLECTION SIMPLE 1
2) CONDITIONAL SIMPLE 1 (Completed)
0) Quit
Choose a challenge: 1
Chosen = 1
Cloning repository = https://github.com/mentzbb/SimpleCollections1
 ...
Done`
  ];

  public static args = [{name: 'all'}];

  protected static flagsConfig = {
    // flag without a value (-a, --all)
    all: flags.boolean({char: 'a', description: messages.getMessage('allFlagDescription')})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  //protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    let success=true;
    let message='';

    const all = this.flags.all || false;

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();

    // Get the collaboration groups
    const query = 'select id, InformationBody, Description, Name from CollaborationGroup where Name like \'% Solutions\'';

    interface Group{
      Id : string,
      Name : string,
      Description : string,
      InformationBody : string
    }

    // Query the setting to see if we need to insert or update
    const groups = await conn.query<Group>(query);

    if (groups.records && groups.records.length > 0) {
      let groupsById=new Map();
      for (let group of groups.records) {
        groupsById.set(group.Id, group);
      }
      let groupIds='';
      for (let groupId of groupsById.keys()) {
        groupIds+=', \'' + groupId + '\''
      }

      // find posts by the current user for these groups
      const userPostsQuery = 'select id, ParentId, Parent.Name from CollaborationGroupFeed where ' + 
                            'InsertedBy.Username = \'' + this.org.getUsername() + '\' and ' + 
                            'ParentId in (' + groupIds.substring(2) + ')';
      
      interface Post{
        Id : string,
        ParentId : string
      }
  
      const posts = await conn.query<Post>(userPostsQuery);

      let postByGroupId=new Map();
      if (posts.records && posts.records.length > 0) {
        for (let post of posts.records) {
          if (!all) {
            groupsById.delete(post.ParentId);
          }
          else {
            postByGroupId.set(post.ParentId, post);
          }
        }
      }

      if (groupsById.size>0) {
        interface Option{
          Id : string,
          Name : string
        }
        let options: Array<Option>=[];
        for (let groupId of groupsById.keys()) {
          let group=groupsById.get(groupId);
          let challenge=group.Name.substring(0, group.Name.indexOf(' Solutions'));
          if (postByGroupId.get(groupId) !== undefined) {
            challenge += ' (Completed)';
          }
          options.push({Id: group.Id, Name: challenge});
        }

        this.ux.log('Select a challenge');
        this.ux.log('');
        if (options.length>0) {
          let chosenVal=-1;
          while (-1==chosenVal) {
            for (let idx=0; idx<options.length; idx++) {
              this.ux.log((idx + 1) + ') ' + options[idx].Name);
            }
            this.ux.log('0) Quit');
            let chosen=await cli.prompt('Choose a challenge');
            this.ux.log('Chosen = ' + chosen);
            chosenVal=Number.parseInt(chosen);
            if (Number.isInteger(chosenVal)) {
              if (0==chosenVal) {
                process.exit(1);
              }
            }

            if ( (Number.isNaN(chosenVal)) || (chosenVal<0) || (chosenVal>options.length)) {
              this.ux.log('Please choose a value between 0 and ' + options.length);
              chosenVal=-1;
            }
          }

          // get the repo URL
          let group=groupsById.get(options[chosenVal-1].Id);
          let repoUrl=group.InformationBody.substring(group.InformationBody.indexOf('http'));
          // TODO: clone the repository using the non-checkout style command
          this.ux.log('Cloning repository = ' + repoUrl);

          execFileSync('git', ['clone', repoUrl], {stdio: 'inherit'});
        }
        else {
          if (all) {
            this.ux.log('No challenges found');
            success=false;
            message='No challenges found';
          }
          else {
            this.ux.log('No challenges found that you haven\'t attempted - rerun with --all flag to see all challenges');
            message='No unattempted challenges found';
          }
        }
      }
      else {
        // put out message
        this.ux.log('No challenge groups found');
        success=false;
        message='No challenge groups found found';
      }
    }
    else {
      this.ux.log('No challenge groups found');
      success=false;
      message='No challenge groups found found';
  }
    
    this.ux.log('Done');

    
    // Return an object to be displayed with --json
    return { success: success, message : message };
  }
}
