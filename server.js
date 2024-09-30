const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./User'); // Імпортуємо модель User
const app = express();
const PORT = 5500; // Змінено порт на 5500

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/User', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Підключено до MongoDB');
})
.catch(err => {
    console.error('Не вдалося підключитися до MongoDB', err);
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Де ваші HTML, CSS та JS файли

// Вхід користувача
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Неправильний email або пароль' }); // Відправка помилки у форматі JSON
        }
        res.json({ name: user.name, email: user.email }); // Відправка успішного входу у форматі JSON
    } catch (error) {
        res.status(500).json({ error: 'Помилка на сервері: ' + error.message }); // Відправка помилки у форматі JSON
    }
});


// Реєстрація нового користувача
// Реєстрація нового користувача
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Користувач з таким email вже існує');
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).send('Користувача зареєстровано');
    } catch (error) {
        res.status(400).send('Помилка реєстрації: ' + error.message);
    }
});


// Скидання пароля
app.post('/resetPassword', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const result = await User.updateOne({ email }, { password: newPassword });
        if (result.modifiedCount === 0) {
            return res.status(404).send('Користувача не знайдено');
        }
        res.send('Пароль успішно скинуто');
    } catch (error) {
        res.status(400).send('Помилка скидання пароля: ' + error.message);
    }
});

// Оновлення профілю
app.post('/updateProfile', async (req, res) => {
    const { email, newName } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            user.name = newName;
            await user.save(); // Зберігаємо зміни в MongoDB
            res.send('Профіль оновлено');
        } else {
            res.status(404).send('Користувача не знайдено');
        }
    } catch (error) {
        res.status(400).send('Помилка оновлення профілю: ' + error.message);
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер працює на http://127.0.0.1:${PORT}`); // Вказано 127.0.0.1
});
