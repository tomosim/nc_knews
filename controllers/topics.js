const connection = require('../db/connection');

const getTopics = (req, res, next) => {
  const {
    limit, offset, orderBy, direction, searchTerm,
  } = req.query;
  const myPromise = connection('topics')
    .limit(limit || 10)
    .offset(offset || 0)
    .orderBy(
      orderBy || 'topic_description',
      direction === 'desc' ? 'desc' : 'asc',
    );
  if (searchTerm) myPromise.where('topic_slug', 'like', `%${searchTerm.toLowerCase()}%`);
  return myPromise.then(topics => res.send({ topics })).catch(next);
};

// const addTopic = (req, res, next) => {
//   console.log(req.body);
//   const newTopic = req.body;
//   return connection('topics')
//     .insert(newTopic)
//     .catch(console.log);
// };

module.exports = { getTopics };
