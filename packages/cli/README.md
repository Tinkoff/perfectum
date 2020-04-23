# Perfectum CLI
The command-line interface for convenient work with Perfectum performance tools :computer:
### ![Perfectum CLI](cli.gif)

## Installation
```sh
yarn global add @perfectum/cli
```

## Usage
```sh
perfectum <command> <options>
```

## Commands
### `audit`
**Description**

Running a project performance audit using [@perfectum/synthetic](../synthetic) library

**Example**
```bash
perfectum audit --urls.main="https://www.example.com" --config="./perfectum.json"
```

**Options**
```bash
--urls, -u                              URLs whose performance you want to audit                           [object]

--config, -c                            Path to configuration file                                         [string]

--numberOfAuditRuns, -n                 Number of performance audit runs                                   [number]

--authenticationScriptPath              Path to authentication script file                                 [string]

--commandExecutionContextPath           Path to execution context directory                                [string]

--skipBuildProject                      Skip the build phase of the project                                [boolean]

--skipStartProject                      Skip the start phase of the project                                [boolean]

--buildProjectCommand                   Command to build the project                                       [string]

--startProjectCommand                   Command to start the project                                       [string]

--buildProjectTimeout                   Timeout for the project build command in minutes                   [number]

--startProjectTimeout                   Timeout for the project start command in minutes                   [number]

--buildProjectCompleteStringPattern     String pattern for listening to the end of the project build       [string]

--startProjectCompleteStringPattern     String pattern for listening to the end of the project start       [string]

--clearReportFilesDirectoryBeforeAudit  Clear the directory with report files before audit                 [boolean]

--version                               Show version number                                                [boolean]

--help                                  Show help                                                          [boolean]
```

For a more flexible configuration of launching an audit use the [Perfectum configuration file](./perfectum.json#L137).
