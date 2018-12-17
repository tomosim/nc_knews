const handle400s = (err, req, res, next) => {
  if (err.code === '42703' || err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else next(err);
};

const handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: 'internal server error' });
};

module.exports = { handle400s, handle500s };
