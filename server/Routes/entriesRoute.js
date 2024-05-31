const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const entriesController = require('../Controllers/entriesController');

router.get('/', auth, entriesController.getEntries);
router.get('/:id', auth, entriesController.getEntry);
router.post('/', auth, entriesController.addEntry);
router.delete('/:id', auth, entriesController.deleteEntry);

module.exports = router;

//entries goes through entries route which is a router that takes you to controller where logic is handled