# gh-project-points
A crappy way to get github point totals from your project board. Useful _only_ on your project board.

That's right. This software is garbage; but it gets the job done.

Also, it will calculate totals for different teams, `bug`s, `spike`s, and regular issues if you have your point labels setup correctly. It

## How to use

### Installation
This script is tampermonkey dependent. 
1. Install tampermonkey (TM)
1. Add the script to tampermonkey (<ctrl>+c, <ctrl>+v)
1. be sure to set your url matches (in TM)  so you can access your projects
1. set it to run in the context menu (in TM)
  
### Basic Use
When you want to check points click `Calc Points!` in your context menu. Points will appear in the column header and look something like `SW - 45 - 17/20/8` where `<team abbreviation> - <total points> - <story points> / <spike points> / <bug points>`. There may or may-not be a `<team abbreviation> - ` at the beginning, depending on whether or not you configure your point labels for use with multiple teams (see next section).

### Use with Multiple Teams
Calc points works just fine if you use the standard `1`,`2`,`3`,`5`,`8`,`13`... but if you have multiple teams in a single board and you're focusing on real algility you know that point-values don't mix well between teams. Calc Points has your back here. If you suffix a specific teams points with ` - <team abbreviation>` and you use that point label suffix consistently for that team across all repos, calc points will be able to break out point totals for the stories that team has pointed.

## Use with Bugs & Spikes 
Add the labels `bug` and `spike` to the appropriate stories. If you never add those labels the corresponding numbers will stay at zero.
