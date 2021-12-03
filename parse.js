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
    let data = fs.readFileSync(file).toString().match(/[<>]|{[A-Za-z0-9]*}/g);
    let pointer = 0;
    let labels = {};
    data.forEach((item, index) => {
        console.log(pointer, item);
        switch (item[0]) {
            case '>':
                pointer++;
                data[index] = ''
                break;
            case '<':
                data[index] = ''
                pointer++
                break;
            case '{':
                let label = item.replaceAll(/[{}]/g, '');
                if (labels[label] || labels[label] == 0) {
                    let delta = pointer - labels[label];
                    console.log(delta);
                    pointer = labels[label];
                    let r = ''
                    if (delta >= 1) {
                        for (let i = 0; i < delta; i++) {
                            r += '<'
                        }
                        data[index] = r;
                    } else {
                        for (let i = 0; i > delta; i--) {
                            r += '>'
                        }
                        data[index] = r;
                    }
                } else {
                    labels[label] = pointer;
                    data[index] = '';
                }
        }
    });
    let d2 = fs.readFileSync(file).toString().match(/[<>,\.\[\]\+-]|{[a-zA-Z0-9]*}/g);
    let currentLabel = 0;
    let labelsDone = [];
    console.log(data);
    data = data.filter(item => item != '');
    console.log(data);
    d2.forEach((item, index) => {
        if (item[0] == '{' && labelsDone.includes(item)) {
            d2[index] = data[currentLabel];
            currentLabel++;
        } else if (item[0] == '{') {
            labelsDone.push(item);
            d2[index] = '';
        }
    });
    let merged = d2.join('');
    fs.writeFileSync(`parsed${file}`, merged);
})();