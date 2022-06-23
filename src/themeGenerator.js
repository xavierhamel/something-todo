// https://github.com/base16-project/base16-schemes

var fs = require('fs');

const readFiles = (dirname) => {
    let output = "";
    let themes = []
    fs.readdir(dirname, (err, filenames) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < filenames.length; i++) {
            const filename = filenames[i];
            let content = fs.readFileSync(dirname + '/' + filename, 'utf-8');
            let [name, extension] = filename.split('.');
            if (extension === 'yaml') {
                if (!isNaN(parseInt(name))) {
                    name = "_" + name;
                }
                themes.push(name);
                output += generateCSS(name, content);
            }
        }

        fs.writeFile('./theme_generated.css', output, (err) => {
            console.log(err);
        });
        fs.writeFile('./themes.json', JSON.stringify(themes), (err) => {
            console.log(err);
        });
        console.log('done with ' + themes.length + ' themes');
    });
};

readFiles('./themes');

const generateCSS = (name, input) => {
    const variables = {
        'bg-primary': '00',
        'fg-primary': '07',
        'bg-secondary': '01',
        'fg-secondary': '03',
        'fg-green': '0C',
        'fg-lime': '0B',
        'fg-blue': '0D',
        'fg-pink': '0E',
    };
    const keys = Object.keys(variables);
    let output = `.${name} {\n    --fg-red: #FB4934;\n`;
    input.split('\n').filter((line) => {
        for (let i = 0; i < keys.length; i++) {
            if (line.includes(`base${variables[keys[i]]}`)) {
                let color = line.split(':')[1].substring(2, 8);
                output += `    --${keys[i]}: #${color};\n`;
                break;
            }
        }
    });
    output += '}\n\n';
    return output;
}
