const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => UserController.getAllUsers(req, res, next));
router.patch('/:id', (req, res, next) => UserController.updateUser(req, res, next));

module.exports = router;