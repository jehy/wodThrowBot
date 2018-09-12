# WodThrowBot

[![Build Status](https://travis-ci.org/jehy/wodThrowBot.svg?branch=master)](https://travis-ci.org/jehy/wodThrowBot)
[![dependencies Status](https://david-dm.org/jehy/wodThrowBot/status.svg)](https://david-dm.org/jehy/wodThrowBot)
[![devDependencies Status](https://david-dm.org/jehy/wodThrowBot/dev-status.svg)](https://david-dm.org/jehy/wodThrowBot?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/jehy/wodThrowBot/badge.svg?branch=master)](https://coveralls.io/github/jehy/wodThrowBot?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/jehy/wodThrowBot/badge.svg)](https://snyk.io/test/github/jehy/wodThrowBot)

Simple bor for throwing dices in VTM mechanics.

You can find it on telegram as `@WodThrowBot`.

#### Syntax
```
/roll numberDice [difficulty] [spec] [damage] [action]
```

##### Where
* `numberDice` is a number of dice you wanna roll
* `difficulty` is a difficulty, lol
* `spec` if you are using speciality (10 counts as 2x successes)
* `damage` if you're gonna roll damage (1 does not subtract successes)
* `action` description of what you're doing

##### Examples
* `/roll 5` - roll 5 dices with base difficulty 6
* `/roll 5 8` - roll 5 dices with difficulty 8
* `/roll 5 8 spec damage` or `/roll 5 8 s d` - roll 5 dices with difficulty 8 using speciality and damage option
* `/roll 5 8 s d mighty action` - same as above with comment "mighty action"

#### For geeks

You can also use this package via cli, like

```bash
npx wodthrowbot 5 8 s d rolling stones
```
