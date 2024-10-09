const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 5500; 


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public')); 


const readData = () => {
    return JSON.parse(fs.readFileSync('Clients.json', 'utf-8'));
};


const writeData = (data) => {
    fs.writeFileSync('Clients.json', JSON.stringify(data, null, 2), 'utf-8');
};


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const users = readData();
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Неправильний email або пароль' });
    }
    res.json({ name: user.name, email: user.email });
});


app.post('/register', async (req, res) => {
    console.log('Request body:', req.body);

    const { login, name, email, password, phone, dob } = req.body;

    if (!login || !name || !email || !password || !phone || !dob) {
        return res.status(400).send('Всі поля повинні бути заповнені');
    }

    const users = readData();

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).send('Користувач з таким email вже існує');
    }

    const newUser = { login, name, email, password, phone, dob };
    users.push(newUser);
    writeData(users);
    res.status(201).send('Користувача зареєстровано');
});


app.post('/resetPassword', async (req, res) => {
    const { email, newPassword } = req.body;

    let users = readData();
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex === -1) {
        return res.status(404).send('Користувача не знайдено');
    }

    users[userIndex].password = newPassword;
    writeData(users);
    res.send('Пароль успішно скинуто');
});


app.post('/updateProfile', async (req, res) => {
    const { email, newName } = req.body;

    let users = readData();
    const user = users.find(user => user.email === email);
    if (user) {
        user.name = newName;
        writeData(users);
        res.send('Профіль оновлено');
    } else {
        res.status(404).send('Користувача не знайдено');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер працює на http://127.0.0.1:${PORT}`);
});
