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
    it('POST adds a new topic object to the database and responds with said topic object and a status of 201', () => request.post('/api/topics').send({ topic_slug: 'topic', topic_description: 'new topic' }).expect(201).then((res) => {
      expect(res.body.newTopic).to.have.all.keys('topic_slug', 'topic_description');
      expect(res.body.newTopic.topic_description).to.equal('new topic');
    }));
    it('POST responds with a status of 400 when the topic object is not in the correct format', () => request.post('/api/topics').send({ bad: 'request' }).expect(400).then((res) => {
      expect(res.body.msg).to.equal('Bad request');
    }));
    describe('/:topic_slug/articles', () => {
      it('GET responds with an empty articles array when there are no articles relating to the topic', () => request.get('/api/topics/nothinghere/articles').expect(200).then((res) => {
        expect(res.body.articles).to.have.length(0);
      }));
      it('GET responds with all articles of a certain topic when no queries given', () => request.get('/api/topics/cats/articles').expect(200).then((res) => {
        expect(res.body.articles).to.have.length(1);
        expect(res.body.articles[0]).to.have.all.keys('article_id', 'article_title', 'article_body', 'article_topic', 'article_created_by', 'article_created_at', 'article_comment_count');
      }));
      it('GET responds with an array of articles limitted by a limit query', () => request.get('/api/topics/mitch/articles?limit=1').expect(200).then((res) => {
        expect(res.body.articles).to.have.length(1);
      }));
      it('GET responds with an array of articles in descending when direction query is "desc"', () => request.get('/api/topics/mitch/articles?direction=desc').expect(200).then((res) => {
        const firstLetter = res.body.articles[0].article_title[0].charCodeAt();
        const secondLetter = res.body.articles[1].article_title[0].charCodeAt();
        expect(firstLetter).to.be.greaterThan(secondLetter);
      }));
      it('GET responds with an array of articles in ascending when direction query is "asc"', () => request.get('/api/topics/mitch/articles?direction=asc').expect(200).then((res) => {
        const firstLetter = res.body.articles[1].article_title[0].charCodeAt();
        const secondLetter = res.body.articles[res.body.articles.length - 1]
          .article_title[0].charCodeAt();
        expect(firstLetter).to.be.lessThan(secondLetter);
      }));
      it('POST adds a new topic object to the database and responds with said topic object and a status of 201', () => request.post('/api/topics/mitch/articles')
        .send({ article_title: 'new article', article_body: 'article content goes here', article_created_by: 1 }).expect(201).then((res) => {
          expect(res.body.newArticle).to.have.all.keys('article_id', 'article_title', 'article_body', 'article_topic', 'article_created_by', 'article_created_at');
          expect(res.body.newArticle.article_title).to.equal('new article');
          expect(res.body.newArticle.article_created_by).to.equal(1);
        }));
      // it('POST responds with a status of 400 when the topic object is not in the correct format', () => request.post('/api/topics/mitch/articles').send({ bad: 'request' }).expect(400).then((res) => {
      //   expect(res.body.msg).to.equal('Bad request');
      // }));
    });
  });
});
