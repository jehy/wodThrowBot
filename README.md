# WodThrowBot

![Build](https://github.com/jehy/wodThrowBot/workflows/Build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/jehy/wodThrowBot/badge.svg?branch=master)](https://coveralls.io/github/jehy/wodThrowBot?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/jehy/wodThrowBot/badge.svg)](https://snyk.io/test/github/jehy/wodThrowBot)

Simple bot for throwing dices in VTM and other mechanics.

You can find it on telegram as `@WodThrowBot`. You can send messages directly to bot
or add it to group and use inline commands.
#### Install with docker compose
```yml
version: '3.9'

services:
  wodthrowbot:
    image: ghcr.io/jehy/wodthrowbot/wod-throw-bot:latest
    volumes:
      - "config:/app/config:ro"
volumes:
  config:
```
And them simply add `runtime.config` with your telegram token to config volume.
#### Syntax
```
/roll numberDice[d(base)=10][x(difficulty)=6] [spec] [damage] [sum] [min] [max] [action]
```

##### Where
* `numberDice` is a number of dice you wanna roll
* `difficulty` is a difficulty, lol
* `spec` if you are using speciality (10 counts as 2x successes)
* `damage` if you're gonna roll damage (1 does not subtract successes)
* `min` - show minimal dice value
* `max` - show maximal dice value
* `action` description of what you're doing

##### Examples
* `/roll 5` - roll 5 d10 dices with base difficulty 6
* `/roll 5x8` - roll 5 d10 dices with difficulty 8
* `/roll 5d6x8` - roll 5 d6 dices with difficulty 8
* `/roll 5d6 sum` - roll 5 d6 dices and count sum
* `/roll 5d6 max` - roll 5 d6 dices and count max value
* `/roll 5x8 spec damage` or `/roll 5 8 s d` - roll 5 d10 dices with difficulty 8 using speciality and damage option
* `/roll 5x8 s d kill troll` - same as above with comment "kill troll"

#### For geeks

You can also use this package via cli, like

```bash
npx wodthrowbot 5x8 s d rolling stones
```
