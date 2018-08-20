# WodThrowBot

[![Build Status](https://travis-ci.org/jehy/wodThrowBot.svg?branch=master)](https://travis-ci.org/jehy/wodThrowBot)
[![dependencies Status](https://david-dm.org/jehy/wodThrowBot/status.svg)](https://david-dm.org/jehy/wodThrowBot)
[![devDependencies Status](https://david-dm.org/jehy/wodThrowBot/dev-status.svg)](https://david-dm.org/jehy/wodThrowBot?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/jehy/wodThrowBot/badge.svg?branch=master)](https://coveralls.io/github/jehy/wodThrowBot?branch=master)

Simple bor for throwing dices in VTM mechanics.

You can find it on telegram as `@WodThrowBot`.

Syntax:
```
/roll numberDice [difficulty] [spec] [damage] [action]
```

Where
* `numberDice` is a number of dice you wanna roll
* `difficulty` is a difficulty, lol
* `spec` if you are using speciality (10 counts as 2x successes)
* `damage` if you're gonna roll damage (1 does not subtract successes)
* `action` description of what you're doing

## For geeks

You can also use this package via cli, like

```bash
npx wodthrowbot 5 8 s d rolling stones
```
