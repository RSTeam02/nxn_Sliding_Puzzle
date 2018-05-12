# (M)NxN Sliding Puzzle

+ 12.05: animate character shifting, choose speed with range slider  
+ 12.05: swap methods for both axis summarized in one 
+ 3.12: split wordchunk method into two methods, seperate rotation part 
+ 1.12: rotate word chunks by 90 degrees clockwise horizontally or vertically (check orthogonal, rebuild)
+ 25.11: now working with rectangular puzzle structure (mxn, puzzle builder) => build puzzles with variable word length and number of words without inserting "#" spaces.
+ 24.11: build your own puzzle with characters => split up the entered word into characters, a space between words indicates a new row. Check which property is the greatest (number of rows or columns). the greatest number will be the square-number of the raster.
+ text input: the pipe ("|") symbol indicates the end of the tile., eg. H|e|ll|o consists of 4 tiles and 5 characters. a tile can be used for more than 1 character. (eg. for double chars like "ll", "ss", "ei"...etc)

The example from https://de.wikipedia.org/wiki/15-Puzzle#Modernes_15-Puzzle fits perfect in a 4x4 raster "O|h|n|e F|l|ei|ß k|e|i|n Pr|ei|s|!", the phrase has the meaning like "without effort, no prize" Non perfect NxN strings with empty spaces will be added with "#" symbols.    

+ test link: https://rsteam02.github.io/nxn_Sliding_Puzzle/

+ css, svg size fix
+ numeric sliding puzzle, select range from 2x2 to 30x30 raster
+ scalable svg tiles 
+ init raster preview => solution state, shuffled => when game starts
+ evaluate and compare position of each tile with the solution, count right placed tiles and compare with solution length (raster size) 
+ application of theory, idea of random, solvable configurations refers to:
https://www.sitepoint.com/randomizing-sliding-puzzle-tiles/
https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html


