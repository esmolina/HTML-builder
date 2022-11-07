const fs = require('fs');
const path = require('path');
const copyPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const record = fs.createWriteStream(bundlePath);

fs.promises.readdir(copyPath, {withFileTypes: true})
    .then(folderElements => {
        folderElements.forEach(
            (element) => {
                if (element.isFile()) {
                    const filePath = path.join(copyPath, element.name);
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