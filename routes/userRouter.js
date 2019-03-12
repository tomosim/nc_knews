const userRouter = require('express').Router();
const { getUsers, getUserById } = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:user_id', getUserById);

module.exports = userRouter;
