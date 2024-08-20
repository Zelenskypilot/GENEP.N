const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

const prefixes = ['+25565', '+25574', '+25568', '+25575'];
const numOfNumbers = 50; // Total number of numbers to generate

function generatePhoneNumber(prefix) {
    const digitsNeeded = 7; // Number of digits needed after the prefix
    let phoneNumber;

    do {
        // Generate a 7-digit number without zeros
        phoneNumber = '';
        for (let i = 0; i < digitsNeeded; i++) {
            phoneNumber += Math.floor(Math.random() * 9) + 1; // Digits 1 to 9
        }
    } while (phoneNumber.includes('0')); // Ensure no zeros are present

    return `${prefix}${phoneNumber}`;
}

function generatePhoneNumbers() {
    const phoneNumbers = [];
    const numbersPerPrefix = Math.ceil(numOfNumbers / prefixes.length);

    for (const prefix of prefixes) {
        for (let i = 0; i < numbersPerPrefix; i++) {
            phoneNumbers.push(generatePhoneNumber(prefix));
        }
    }
    return phoneNumbers.slice(0, numOfNumbers); // Trim to ensure exactly numOfNumbers
}

app.get('/phone-numbers', (req, res) => {
    const phoneNumbers = generatePhoneNumbers();
    res.setHeader('Content-Type', 'text/plain');
    res.send(phoneNumbers.join(', '));
});

app.get('/download', (req, res) => {
    const phoneNumbers = generatePhoneNumbers();
    const fileName = 'phone_numbers.txt';
    const filePath = path.join(__dirname, fileName);

    fs.writeFile(filePath, phoneNumbers.join(', '), (err) => {
        if (err) {
            res.status(500).send('Error generating file');
            return;
        }
        res.download(filePath, fileName, (err) => {
            if (err) {
                res.status(500).send('Error downloading file');
            }
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
