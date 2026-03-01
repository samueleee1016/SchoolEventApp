const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require('../controllers/controller');
const validateCourse = require('../middlewares/validateCourse.middleware');
const validateRegistration = require('../middlewares/validateRegistration.middleware');

router.get('/inserimentoCorsi', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/inserimentoCorsi.html'));
});

router.get('/registrazione', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/registrazione.html'));
});

router.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/corsi.html'));
});

router.post('/createCourse', validateCourse.validateCourse, controller.insering);

router.post('/validateRegistration', validateRegistration.validateRegistration, controller.registration);

router.all(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/getAll.html'));
});

module.exports = router;