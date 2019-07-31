mentz
=====

Solution publishing plugin for the Mentz community mentoring concept.

[![Version](https://img.shields.io/npm/v/mentz.svg)](https://npmjs.org/package/mentz)
[![Downloads/week](https://img.shields.io/npm/dw/mentz.svg)](https://npmjs.org/package/mentz)
[![License](https://img.shields.io/npm/l/mentz.svg)](https://github.com/keirbowden/mentzplugin/blob/master/package.json)

# Installation
```sh-session
$ sfdx plugins:install mentz
```
# Commands
* [sfdx mentz:publish [FILE]](#sfdx-mentzpublish-file)
* [sfdx mentz:challenges](#sfdx-mentzchallenges)

## `sfdx mentz:publish [FILE]`
publishes a solution, optionally asking for mentor feedback

```
USAGE
  $ sfdx mentz:publish [FILE]

OPTIONS
  -c, --comment=comment                           optional comment regarding the solution
  -f, --file=file                                 file containing the solution
  -m, --mentor                                    request mentor feedback
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  $ sfdx mentz:publish --targetusername myOrg@example.com --comment "I'm not sure about line 8" -f 
  src/classes/Solution.cls
     Published the solution for CHALLENGE 1  
  $ sfdx mentz:publish --targetusername myOrg@example.com --mentor -f src/classes/Solution.cls
     Requested mentoring for the solution for CHALLENGE 1
```

## `sfdx mentz:challenges`

lists available challenges for the user to select from and clones the repository for the selected challenge
into a subdirectory

```
USAGE
  $ sfdx mentz:challenges

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  -a, --all                                       list all challenges, including those already completed
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
$ sfdx mentz:challege --targetusername myOrg@example.com 
  Select a challenge

1) COLLECTION SIMPLE 1
0) Quit
Choose a challenge: 1
Chosen = 1
Cloning repository = https://github.com/mentzbb/SimpleCollections1
 ...
Done

  $ sfdx mentz:publish --targetusername myOrg@example.com --all
  Select a challenge

1) COLLECTION SIMPLE 1
2) CONDITIONAL SIMPLE 1 (Completed)
0) Quit
Choose a challenge: 1
Chosen = 1
Cloning repository = https://github.com/mentzbb/SimpleCollections1
 ...
Done
```



# License
MIT
