import fs from 'fs';
const stdin = process.stdin;

function prompt(question) {
    return new Promise((resolve) => {
        stdin.resume();
        stdin.setEncoding('utf8');
        process.stdout.write(question);
        stdin.once('data', data => {
            resolve(data.trim());
        });
    })
};

(async () => {
    let file = await prompt('Enter file name: ');
    if (fs.existsSync(file)) {
        let args = await prompt('Enter arguments, seperated by a comma: ')
        args = args.split(',');
        let data = fs.readFileSync(file, 'utf8');
        let split = data.toString().match(/[<>,\.\[\]\+-]|{[a-zA-Z0-9]*}/g);
        let parsed = [];
        let depth = 0;
        let labels = {};
        let pointTest = 0;
        // This bad ~~code~~ boy is the lexer. It sorts through the commands, and gives them metadata so that I
        // can work with them better.
        // It keeps track of depth (scope) and where the pointer would be during execution
        // The depth is incremented on '[' and decremented on ']'
        // The pointer is incremented on '>', decremented on '<'
        // And it can be set by labels
        // When it gets to a label, it checks whether we have it's target stored.
        // If it does, pointer goes there.
        // If it doesn't, we save its position as that label's target.
        // When we get to a closing bracket, we need to get it's start pos, as well as setting the start pos'
        // closing bracket.
        // We simple go backwords through the array, and check whether it is open brackets and on our level.
        // It it is, we set the open value to it's location, and set it's close value to our location.
        // That's basically it, brainfuck is simple as hell.
        split.forEach((char, index) => {
            parsed[index] = { command: char, depth: depth };
            switch (char[0]) {
                case '[':
                    depth++;
                    break;
                case ']':
                    depth--;
                    let open;
                    for (let i = index; i >= 0; i--) {
                        if (parsed[i].command === '[' && parsed[i].depth === depth) {
                            open = i;
                            parsed[i].endLoc = index;
                            break;
                        }
                    }
                    parsed[index].origin = open;
                    break;
                case '{':
                    // Label
                    let label = char.replaceAll(/[{}]/g, '');
                    parsed[index].label = label;
                    if (labels[label] || labels[label] == 0) {
                        parsed[index].moveCount = labels[label] - pointTest;
                        pointTest = labels[label];
                    } else {
                        labels[label] = pointTest;
                    }
                    break;
                case '>':
                    pointTest++;
                    break;
                case '<':
                    pointTest--;
                    break;
            }
            if (index == split.length - 1) {
                parsed[index].end = true;
            }
        });
        let mem = [];
        let pointer = 0;
        let cmdPointer = 0;
        let argsPointer = 0;
        let running = true; 
        // This is the main loop for the entire thing. It does whatever the command makes it do.
        while (running) {
            let cmd = parsed[cmdPointer];
            if (!mem[pointer]) mem[pointer] = 0;
            switch (cmd.command[0]) {
                case '<': // Dec pointer
                    pointer--;
                    break;
                case '>': // Inc pointer
                    pointer++;
                    break;
                case '+': // Inc mem at pointer
                    mem[pointer]++;
                    break;
                case '-': // Dec mem at pointer
                    mem[pointer]--;
                    break;
                case '.': // Output mem at pointer
                    console.log(mem[pointer]);
                    break;
                case ',': // This one needs a bit more explanation. It gets the current argument that is open,
                // and sets the mem at pointer to it. It then increments the arg pointer, so we can get diff 
                // args for the others.
                // I'd just wait for user input, but brainfuck only accepts input at the start (as defined), so
                // Here we are. No real difference honestly, but eh, i want it to be faithful.
                    mem[pointer] = args[argsPointer] || args[args.length - 1];
                    argsPointer++;
                    break;
                case '[': // If we are <=0 when we get here, it shouldnt loop, so go to end.
                    if (mem[pointer] <= 0) {
                        cmdPointer = cmd.endLoc;
                    }
                    break;
                case ']': // Return to open if not <= 0
                    if (mem[pointer] > 0) {
                        cmdPointer = cmd.origin;
                    }
                    break;
                case '{': // if it has a move count, move by it (cause some are just going to be declarations)
                    if (cmd.moveCount) {
                        pointer += cmd.moveCount;
                    }
                    break;
            }
            if (parsed[cmdPointer].end) {
                running = false;
            }
            cmdPointer++;
        }
        process.exit();
    } else {
        console.log('File does not exist');
        process.exit(1);
    }
})();