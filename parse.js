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
    let file = await prompt('Input file: ');
    if (!fs.existsSync(file)) throw new Error('File does not exist!');
    let data = fs.readFileSync(file);
    let split = data.toString().match(/[<>,\.\[\]\+-]|{[a-zA-Z0-9]*}/g);
    let parsed = [];
    let depth = 0;
    let labels = {};
    let pointTest = 0;
    /*
    * This is the same lexer as in index.js, so if you want to know how it works, go there
    */
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
    // Convert backwards lol
    // This method has one major issue: in bf, when I want to define a bunch of labels, i need to do like
    // >{}>{}
    // But then if I run it through my code, it keeps the >
    // so it would parse to >><<
    // oh well, too much effort to fix lol
    // This function literally just goes through the commands, and replaces each label with it's assigned movecount
    // of arrows (i.e. -3 would be <<<, 3 would be >>>)
    let raw = ''
    parsed.forEach(command => {
        if(command.command[0] != '{') {
            raw += command.command;
        } else if(command.moveCount) {
            let arrow = '';
            if(command.moveCount > 0) { // Positive means it needs to be a >, negetive means <, and im too lazy to do
                // absolute value then just like arrow += Math.sign(command.moveCount) == 1 ? '>' : '<';
                // mostly b/c i just thought of it and its too much effort for me to implement
                for(let i = 0; i < command.moveCount; i++) {
                    arrow += '>';
                }
            } else {
                for(let i = 0; i > command.moveCount; i--) {
                    arrow += '<';
                }
            }
            raw += arrow;
        }
    });
    fs.writeFileSync(`parsed${file}`, raw);
    process.exit(); // Too lazy to stop stdin, this works so eh
})();