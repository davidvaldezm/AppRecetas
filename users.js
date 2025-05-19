const express = require('express');
const router = express.Router();
const { loadData, saveData } = require('../controllers/dataHandler');

const usersFile = './app/data/users.json';

router.post('/register', (req, res) => {
    const users = loadData(usersFile);
    if (users.find(u => u.email === req.body.email))
        return res.status(400).json({ message: 'Email ya registrado' });
    const newUser = {
        id: Date.now().toString(),
        ...req.body
    };
    users.push(newUser);
    saveData(usersFile, users);
    res.status(201).json(newUser);
});

router.post('/login', (req, res) => {
    const users = loadData(usersFile);
    const user = users.find(u => u.email === req.body.email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
});

module.exports = router;
