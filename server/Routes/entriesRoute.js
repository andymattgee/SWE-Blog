const express = require('express');
const router = express.Router();
// import entriesController from '../Controllers/entriesController'
const entriesController = require('../Controllers/entriesController');

router.get('/', entriesController.getEntries);
router.get('/:id', entriesController.getEntry);
router.post('/', entriesController.addEntry);
router.delete('/:id', entriesController.deleteEntry);

module.exports = router;

//entries goes through entries route which is a router that takes you to controller where logic is handled