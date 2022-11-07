const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');
const userMessagesChannel = process.stdout;

fs.readdir(folderPath, {withFileTypes: true},
    (err, files) => {
    if (err) { throw err };
    files.forEach(file => {
        if (file.isFile()) {
            const filePath = path.join(__dirname, 'secret-folder', file.name);
            const fileName = path.basename(filePath);
            const fileExtension = path.extname(filePath);
            fs.stat(filePath,
                (err, obj) => {
                    if (err) { throw err };
                    const fileSize = obj.size;
                    const extLength = fileExtension.length;
                    const nameLength = fileName.length - extLength;
                    userMessagesChannel.write(`name: ${fileName.slice(0, nameLength)}\| extension: ${fileExtension.slice(1)}\| size: ${Math.ceil(fileSize)} bytes\n`);
                })
        };
    });
})
