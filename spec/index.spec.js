process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);


describe('/api', () => {
  beforeEach(() => connection.migrate.rollback({ directory: './db/migrations' })
    .then(() => connection.migrate.latest({ directory: './db/migrations' }))
    .then(() => connection.seed.run({ directory: './db/seeds' })));
  after(() => {
    connection.destroy();
  });
  describe('/topics', () => {
    it('GET responds with all topics when no queries given', () => request.get('/api/topics').expect(200).then((res) => {
      expect(res.body.topics).to.have.length(2);
      expect(res.body.topics[0]).to.have.all.keys('topic_slug', 'topic_description');
    }));
    it('GET responds with an array of topics limitted by a limit query', () => request.get('/api/topics?limit=1').expect(200).then((res) => {
      expect(res.body.topics).to.have.length(1);
    }));
    it('GET responds with an array of topics in descending when direction query is "desc"', () => request.get('/api/topics?direction=desc').expect(200).then((res) => {
      const firstLetter = res.body.topics[0].topic_description[0].charCodeAt();
      const secondLetter = res.body.topics[1].topic_description[0].charCodeAt();
      expect(firstLetter).to.be.greaterThan(secondLetter);
    }));
    it('GET responds with an array of topics in ascending when direction query is "asc"', () => request.get('/api/topics?direction=asc').expect(200).then((res) => {
      const firstLetter = res.body.topics[1].topic_description[0].charCodeAt();
      const secondLetter = res.body.topics[0].topic_description[0].charCodeAt();
      expect(firstLetter).to.be.greaterThan(secondLetter);
    }));
    it('GET responds with an array of topics ordered by topic_description when orderBy query is "topic_description"', () => request.get('/api/topics?orderBy=topic_description').expect(200).then((res) => {
      const firstLetter = res.body.topics[0].topic_description[0].charCodeAt();
      const secondLetter = res.body.topics[1].topic_description[0].charCodeAt();
      expect(secondLetter).to.be.greaterThan(firstLetter);
    }));
    it('GET responds with a filtered list of topics when a searchTerm query is used', () => request.get('/api/topics?searchTerm=mitch').expect(200).then((res) => {
      expect(res.body.topics[0].topic_slug).to.equal('mitch');
    }));
    it('GET responds with a 400 status when a bad query is used', () => {

    });
  });
});
