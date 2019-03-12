const connection = require('../db/connection');

const getUsers = (req, res, next) => connection('users')
  .then(users => res.send({ users }))
  .catch(next);

const getUserById = (req, res, next) => {
  const { user_id } = req.params;
  return connection('users').where({ user_id }).then(([user]) => {
    if (!user) res.status(404).send({ msg: 'User not found' });
    else res.send({ user });
  }).catch(next);
};

module.exports = { getUsers, getUserById };
