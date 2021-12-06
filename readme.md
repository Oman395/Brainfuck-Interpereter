# Simple brainfuck interpereter
Brainfuck is fun to write, but all the compilers/interpereters I found used keycodes and I don't like that, so I wrote it to run off integers for much easier math.

## Labels
My interpereter supports labels, which are used with the syntax {label}. When you name a label, it saves that memory position to the label. Every time you call a label afterwords, it is replaced before runtime by a set of arrows, and will act as such. Parse.js can be used to parse it into vanilla brainfuck, which is literally just replaces it with the arrows.

## Brainfuck itself
### Brainfuck is fairly simple, but here's a list of commands.

\> - Increment memory pointer

< - Decrement memory pointer

\+ - Increment memory at pointer

\- - Decrement memory at pointer

. - Output memory at pointer

, - Set memory at pointer to current argument. Arguments are stored as an array, with a pointer-- Each is simply split by ',' when the program is run.

[ - Open loop. If memory at pointer is <= 0 when you reach this, it skips to the end.

] - Close loop. If memory at pointer is not <= 0, go back to open. Otherwise, continue.

### Custom commands

{} - Label. See above.