const formatTopicData = topicData => {
  return topicData.map(topicDatum => {
    return {
      topic_slug: topicDatum.slug,
      topic_description: topicDatum.description
    };
  });
};

module.exports = { formatTopicData };
