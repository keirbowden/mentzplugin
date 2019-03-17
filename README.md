mentz
=====

Solution publishing plugin for the Mentz community mentoring concept.

[![Version](https://img.shields.io/npm/v/mentz.svg)](https://npmjs.org/package/mentz)
[![CircleCI](https://circleci.com/gh/keirbowden/mentzplugin/tree/master.svg?style=shield)](https://circleci.com/gh/keirbowden/mentzplugin/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/keirbowden/mentzplugin?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/mentzplugin/branch/master)
[![Codecov](https://codecov.io/gh/keirbowden/mentzplugin/branch/master/graph/badge.svg)](https://codecov.io/gh/keirbowden/mentzplugin)
[![Greenkeeper](https://badges.greenkeeper.io/keirbowden/mentzplugin.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/keirbowden/mentzplugin/badge.svg)](https://snyk.io/test/github/keirbowden/mentzplugin)
[![Downloads/week](https://img.shields.io/npm/dw/mentz.svg)](https://npmjs.org/package/mentz)
[![License](https://img.shields.io/npm/l/mentz.svg)](https://github.com/keirbowden/mentzplugin/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g mentz
$ mentz COMMAND
running command...
$ mentz (-v|--version|version)
mentz/0.0.0 darwin-x64 node-v11.10.1
$ mentz --help [COMMAND]
USAGE
  $ mentz COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`mentz mentz:publish [FILE]`](#mentz-mentzpublish-file)

## `mentz mentz:publish [FILE]`

publishes a solution, optionally asking for mentor feedback

```
USAGE
  $ mentz mentz:publish [FILE]

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

_See code: [src/commands/mentz/publish.ts](https://github.com/keirbowden/mentzplugin/blob/v0.0.0/src/commands/mentz/publish.ts)_
<!-- commandsstop -->