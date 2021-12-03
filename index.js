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
    let args = await prompt('Enter arguments, seperated by a comma: ')
    args = args.split(',');
    if (fs.existsSync(file)) {
        let data = fs.readFileSync(file, 'utf8');
        let split = data.toString().match(/[<>,\.\[\]\+-]|{[a-zA-Z0-9]*}/g);
        let parsed = [];
        let depth = 0;
        let labels = {};
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
        while (running) {
            let cmd = parsed[cmdPointer];
            if (!mem[pointer]) mem[pointer] = 0;
            switch (cmd.command[0]) {
                case '<':
                    pointer--;
                    break;
                case '>':
                    pointer++;
                    break;
                case '+':
                    mem[pointer]++;
                    break;
                case '-':
                    mem[pointer]--;
                    break;
                case '.':
                    console.log(mem[pointer]);
                    break;
                case ',':
                    mem[pointer] = args[argsPointer] || args[args.length - 1];
                    argsPointer++;
                    break;
                case '[':
                    if (mem[pointer] <= 0) {
                        cmdPointer = cmd.endLoc;
                    }
                    break;
                case ']':
                    if (mem[pointer] > 0) {
                        cmdPointer = cmd.origin;
                    }
                    break;
                case '{':
                    if (labels[cmd.label] || labels[cmd.label] == 0) {
                        pointer = labels[cmd.label];
                    } else {
                        labels[cmd.label] = pointer;
                    }
                    break;
            }
            if (parsed[cmdPointer].end) {
                running = false;
            }
            cmdPointer++;
        }
    } else {
        console.log('File does not exist');
        process.exit(1);
    }
})();