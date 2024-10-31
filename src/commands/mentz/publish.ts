import {core, flags, SfdxCommand} from '@salesforce/command';
import {AnyJson} from '@salesforce/ts-types';
import { basename } from 'path';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('mentz', 'mentz');

export default class Org extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx mentz:publish --targetusername myOrg@example.com --comment "I'm not sure about line 8" -f src/classes/Solution.cls
  Published the solution for CHALLENGE 1  `,
  `$ sfdx mentz:publish --targetusername myOrg@example.com --mentor -f src/classes/Solution.cls
  Requested mentoring for the solution for CHALLENGE 1
  `
  ];

  public static args = [{name: 'file'}];

  protected static flagsConfig = {
    // flag without a value (-m, --mentor)
    mentor: flags.boolean({char: 'm', description: messages.getMessage('mentorFlagDescription')}),
    // flag with a value (-c, --comment=VALUE)
    comment: flags.string({char: 'c', description: messages.getMessage('commentFlagDescription')}),
    // flag with a value (-f, --file=VALUE),
    file: flags.string({char: 'f', description: messages.getMessage('fileFlagDescription')}),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  //protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const fs = require("fs");
    const filepath=this.flags.file || '';

    if (''===filepath) {
      this.ux.error('Missing solution file(s) (-f)');
      process.exit(-1);
    }

    const mentor = this.flags.mentor || false;
    const comment = this.flags.comment || '';

    interface ContentVersion {
      Title : string,
      Description : string,
      PathOnClient : string,
      VersionData : string
    }
    let challenge=fs.readFileSync('CHALLENGE');
    challenge=String(challenge);
    challenge=challenge.substring(0, challenge.length-1);

    let descrip=challenge + ' ' + (mentor?'Mentoring':'Solutions');
    let solution='';
    let filepaths=filepath.split(',');
    if (filepaths.length>1) {
      for (let fp of filepaths) {
        let fname=basename(fp);
        solution+='\n----------------------------\n';
        solution+=fname + '\n';
        solution+='----------------------------\n\n';
        solution+=fs.readFileSync(fp);
      }
    }
    else {
      solution=fs.readFileSync(filepath);
    }

    let solutionB64=Buffer.from(solution).toString('base64');
    let instance : ContentVersion;
    instance={"Title": 'solution.txt',
              "Description": descrip + ':' + comment,
              "PathOnClient":'/Solution.txt',
              "VersionData":solutionB64};    
    
    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    let opResult=await conn.sobject('ContentVersion').insert(instance);    

    if (!opResult.success) {
      this.ux.log('Error publishing solution');
    }
    else {
      if (mentor) {
        this.ux.log('Requested mentoring for the solution for ' + challenge);
      }
      else {
        this.ux.log('Published the solution for ' + challenge);
      }
    }
    
    // Return an object to be displayed with --json

    return { orgId: this.org.getOrgId(), success: opResult.success };
  }
}
