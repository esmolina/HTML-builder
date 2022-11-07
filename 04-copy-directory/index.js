const fs = require('fs');
const path = require('path');
const origPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');


function copyFile(originalPath, savedPath) {
    fs.readdir(originalPath,
        {withFileTypes: true},
        (err, folderContent) => {
            if(err) throw err;
            folderContent.map(folderElement => {
                const copiedFilePath = path.join(originalPath, folderElement.name);
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

function copyDir() {
    //remove old directory
    fs.stat(copyPath, err => {
        if (!err) {
            fs.rmdir(copyPath, {recursive: true, force: true}, err => {
                fs.promises.mkdir(copyPath, {recursive: true});
                copyFile(origPath, copyPath);
                if (err) {
                    throw err
                }
            });
        }

        fs.promises.mkdir(copyPath, {recursive: true});
        copyFile(origPath, copyPath);
    })
}

copyDir()