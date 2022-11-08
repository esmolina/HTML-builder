const fs = require('fs');
const path = require('path');
const {stdin} = process;
const userMessagesChannel = process.stdout;
const filePath = path.join(__dirname, 'recording.txt');

// We show prompt message only first time
let additionalMessageIsShowed = false;

const countOfNewLineSymbols = process.platform === "win32" ? 2 : 1;

// Initialization
function fileOpening() {
    fs.writeFile(
    filePath,
    '',
    (err) => {
        if (err) {throw err}
        userMessagesChannel.write('Hello, my friend!\nThe file has been created. What would you like to write in it?\n> ');
    })
}

function readFile() {
    fs.readFile(filePath, 'utf-8',
        (err, data) => {
            if (err) { throw err };
            userMessagesChannel.write(data.slice(0, -1));
        }
    )
}

// For process entered data from user
function registerUserInputHandler() {
    stdin.on('data', enteredSymbols => {
        const content = `${enteredSymbols}`;
        // We have to exit by "exit" word
        // May be, will be better content.trimEnd().toLowerCase() if spaces at the end are not important
        if (content.slice(0, -countOfNewLineSymbols).toLowerCase() === 'exit') {
            userMessagesChannel.write(`Good job. Goodbye\n`);
            process.exit(0);
        }

        // Data from user to file
        fs.appendFile(
            filePath,
            content,
            (err) => {
                if (err) {throw err}
            }
        );

        // Just small improvement for user interface
        if (!additionalMessageIsShowed) {
            userMessagesChannel.write('Maybe add something? For exit press "Ctrl+C" or enter "Exit"\n> ');
            additionalMessageIsShowed = true;
        } else {
            userMessagesChannel.write('> ');
        }
    })
}

function registerExitEvent() {
    // Exit by CTRL+C
    process.on('SIGINT', () => {
        userMessagesChannel.write('Terminator here and he is terminating anything\n');
        process.exit(0);
    });

    // Signal of closing from OS
    process.on('SIGTERM', () => {
        userMessagesChannel.write('Good bye, my friend, goooood byyyyyyye\n');
        process.exit(0);
    });

    // process.on('exit', () => {
    //     console.log(`Good job. Goodbye`);
    // });
}

fileOpening();
registerUserInputHandler();
registerExitEvent();

