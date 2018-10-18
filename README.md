# gh-project-points
A crappy way to get github point totals from your project board. Useful _only_ on your project board.

That's right. This software is garbage; but it gets the job done.

Also, it will calculate totals for different teams, `bug`s, `spike`s, and regular issues if you have your point labels setup correctly. It

## How to use

### Installation
This script is tampermonkey dependent. 
1. Install tampermonkey (TM)
1. Add the contents of [main.js](./main.js) to tampermonkey (\<ctrl>+c, \<ctrl>+v)
1. be sure to set your url matches (in TM)  so you can access your projects
1. set it to run in the context menu (in TM)
  
### Basic Use
When you want to check points click `Calc Points!` in your context menu. Points will appear in the column header and look something like `SW - 45 - 17/20/8` where `${team abbreviation} - ${total points} - ${story points} / ${spike points} / ${bug points}`. There may or may-not be a `${team abbreviation} - ` at the beginning, depending on whether or not you configure your point labels for use with multiple teams (see next section).

### Use with Multiple Teams
Calc points works just fine if you use the standard `1`,`2`,`3`,`5`,`8`,`13`... but if you have multiple teams in a single board and you're focusing on real algility you know that point-values don't mix well between teams. Calc Points has your back here. If you suffix a specific team's points with ` - ${team abbreviation}` and you use that point label suffix consistently for that team across all repos, calc points will be able to break out point totals for the stories that team has pointed.

Example, two teams `Banana` and `For Scale`. You might have the abbreviations `BNA` and `FS`. You'd have two sets of labels on each repo, one that looked something like `1 -BNA`,`2 - BNA`,`3 - BNA` ... another that looked like `1 - FS`,`2 - FS`,`3 - FS` and so on.

**Note:** *You must* separate the points from the team name with ` - ` (a single space on either side of the dash). If you don't, your points totals will be off.

### CSV output of 'Done' Columns
If, like so many teams, you have one 'Done' column per sprint and you number your sprints, you can get an ordered per-team CSV from the console. Your done columns need to be titled as follows `Done - Sprint ${int sprint number}`.

To get a CSV for a given group, `SW` you'd open the console and type `columnDataMatrix.toCSV.SW()`. If you want to get un-grouped points you can `columnDataMatrix.toCSV()` which is equivalent to typing `columnDataMatrix.toCSV._generic()`.

Output will look something like ...
```csv
Sprint, Total, Stories, Spikes, Bugs
1,137,113,23,1
4,55,55,0,0
5,76,63,13,0
6,68,68,0,0
7,72,72,0,0
8,94,91,3,0
9,46,46,0,0
10,107,107,0,0
11,77,54,23,0
12,53,53,0,0
13,86,83,3,0
14,100,53,32,15
15,114,73,8,33
16,92,77,0,15
Current,38,21,8,9
```

## Use with Bugs & Spikes 
Add the labels `bug` and `spike` to the appropriate stories. If you never add those labels the corresponding numbers will stay at zero.

## Updates

If there's something cool you want to see, either code & PR or make an issue (ask me to write it for you, you lazy bum). 
