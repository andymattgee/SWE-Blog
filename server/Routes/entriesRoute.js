const express = require('express');
const router = express.Router();
// import entriesController from '../Controllers/entriesController'
const entriesController = require('../Controllers/entriesController');

router.get('/', entriesController.getEntries);
router.post('/', entriesController.addEntry);

module.exports = router;