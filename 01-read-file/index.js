const fs = require('fs')
const path = require('path');
const dataPath = path.join(__dirname, 'text.txt');
const {Transform} = require('stream');
const userMessagesChannel = process.stdout;

// fs.readFile(
//     path.join(__dirname, 'text.txt'),
//     'utf-8',
//     (err, data) => {
//         if (err) throw err;
//         userMessagesChannel.write(data);
//     }
// )

const readStr = fs.createReadStream(dataPath, 'utf-8');
readStr.on('data', data => userMessagesChannel.write(data));


