const express = require('express');
const router = new express.Router();

const tasks = require('./controllers/tasks');

router.get('/favicon.ico', (req, res) => res.sendStatus(204));

router.get('/', tasks.list);
router.get('/:name', tasks.item);

router.all('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
