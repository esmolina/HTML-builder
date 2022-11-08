const fs = require('fs');
const path = require('path');
const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const projectPath = path.join(__dirname, 'project-dist');
const markupSourcePath = path.join(__dirname, 'template.html');
const markupResultPath = path.join(__dirname, 'project-dist', 'index.html');
const copiedAssetsPath = path.join(__dirname, 'project-dist', 'assets');

//create directory
// fs.promises.mkdir(projectPath, { recursive: true });

(async function createDir() {
    //remove old directory
    fs.promises.stat(projectPath, err => {
        if (!err) {
            fs.rmdir(projectPath, {recursive: true, force: true}, err => {
                fs.promises.mkdir(projectPath, {recursive: true});
                if (err) {
                    throw err
                }
                fs.promises.open(path.join(__dirname, 'project-dist', 'style.css'), 'r+', (err) => {
                    if(err) throw err;
                });
            });
        }

       fs.promises.mkdir(projectPath, { recursive: true });
        fs.promises.open(path.join(__dirname, 'project-dist', 'style.css'), 'r+', (err) => {
            if(err) throw err;
        });

    })
}())


//create index.html
async function buildHtml() {
    let readBuffer = await fs.promises.readFile(markupSourcePath, 'utf-8');
    let direntArray = await fs.promises.readdir(componentsPath, {withFileTypes: true});
    for (let element of direntArray) {
        const filePath = path.join(componentsPath, element.name);
        if (element.isFile() && path.extname(filePath) === '.html') {
            const fileName = path.basename(filePath);
            const nameLength = fileName.length - 5;
            const pattern = `{{${fileName.slice(0, nameLength)}}}`;
            const replaceValue = await fs.promises.readFile(filePath, 'utf-8');
            readBuffer = readBuffer.replace(pattern, replaceValue);
        }
    }
    await fs.promises.writeFile(markupResultPath, `${readBuffer}`, err => {if (err) {throw err}});
}
buildHtml()

// create style.css
fs.promises.readdir(stylesPath, {withFileTypes: true})
    .then(folderElements => {
        const unitedStylesPath = path.join(__dirname, 'project-dist', 'style.css');
        const record = fs.createWriteStream(unitedStylesPath);
        folderElements.forEach(
            (element) => {
                if (element.isFile()) {
                    const filePath = path.join(stylesPath, element.name);
                    if (path.extname(filePath) === '.css') {
                        const read = fs.createReadStream(filePath, 'utf-8');
                        read.pipe(record).on('error',
                            (err) => {
                                if (err) throw err
                            });
                    }

                }

            })
    })


//copy assets
async function copyFile(assetsPath, savedPath) {
        fs.readdir(assetsPath,
        {withFileTypes: true},
        (err, folderContent) => {
            if(err) throw err;
            folderContent.map(folderElement => {
                const copiedFilePath = path.join(assetsPath, folderElement.name);
                const newCopyPath = path.join(savedPath, folderElement.name);
                if (folderElement.isFile()) {
                    fs.copyFile(copiedFilePath,
                        newCopyPath,
                        (err) => {
                            if (err) throw err;
                            // console.log(`${folderElement.name} was copied to ${newCopyPath}`)
                        });
                }
                if (folderElement.isDirectory()) {
                    fs.mkdir(newCopyPath,
                        {recursive: true},
                        (err) => {
                            if (err) throw err;
                            // console.log(`${folderElement.name} is directory`)
                        });
                    copyFile(copiedFilePath, newCopyPath);
                }
            })
        })
}

(async function copyDir() {
    //remove old directory
    fs.stat(copiedAssetsPath, err => {
        if (!err) {
            fs.rmdir(copiedAssetsPath, {recursive: true, force: true}, err => {
                fs.promises.mkdir(copiedAssetsPath, {recursive: true});
                copyFile(assetsPath, copiedAssetsPath);
                if (err) {
                    throw err
                }
            });
        }

        fs.promises.mkdir(copiedAssetsPath, {recursive: true});
        copyFile(assetsPath, copiedAssetsPath);
    })
}())