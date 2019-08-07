hatchout-cli
============



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/hatchout-cli.svg)](https://npmjs.org/package/hatchout-cli)
[![Downloads/week](https://img.shields.io/npm/dw/hatchout-cli.svg)](https://npmjs.org/package/hatchout-cli)
[![License](https://img.shields.io/npm/l/hatchout-cli.svg)](https://github.com/DE-labtory/hatchout/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g hatchout-cli
$ hatchout-cli COMMAND
running command...
$ hatchout-cli (-v|--version|version)
hatchout-cli/0.0.1 darwin-x64 node-v10.15.3
$ hatchout-cli --help [COMMAND]
USAGE
  $ hatchout-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`hatchout-cli hello [FILE]`](#hatchout-cli-hello-file)
* [`hatchout-cli help [COMMAND]`](#hatchout-cli-help-command)

## `hatchout-cli hello [FILE]`

describe the command here

```
USAGE
  $ hatchout-cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ hatchout-cli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/DE-labtory/hatchout/blob/v0.0.1/src/commands/hello.ts)_

## `hatchout-cli help [COMMAND]`

display help for hatchout-cli

```
USAGE
  $ hatchout-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_
<!-- commandsstop -->
