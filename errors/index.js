const handle400s = (err, req, res, next) => {
  if (err.code === '42703' || err.code === '22P02' || err.status === 400) {
    res.status(400).send({ msg: 'Bad request' });
  } else next(err);
};

const handle404s = (err, req, res, next) => {
  if (err.code === '23503' || err.status === 404) res.status(404).send({ msg: err.msg || 'Not found' });
  else next(err);
};

const handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: 'internal server error' });
};

module.exports = { handle400s, handle404s, handle500s };
