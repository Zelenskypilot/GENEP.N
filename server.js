const express = require('express');
const app = express();
const port = 3000;

const prefixes = ['+25565', '+25574', '+25568', '+25575'];
const numOfNumbers = 50; // Adjust as needed

function generatePhoneNumber(prefix) {
    const randomNumber = Math.floor(Math.random() * 1000000000).toString().padStart(10, '0');
    return `${prefix}${randomNumber}`;
}

function generatePhoneNumbers() {
    const phoneNumbers = [];
    for (const prefix of prefixes) {
        for (let i = 0; i < numOfNumbers / prefixes.length; i++) {
            phoneNumbers.push(generatePhoneNumber(prefix));
        }
    }
    return phoneNumbers;
}

app.get('/phone-numbers', (req, res) => {
    const phoneNumbers = generatePhoneNumbers();
    res.send(phoneNumbers.join(', '));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
