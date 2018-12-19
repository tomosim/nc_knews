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
    it('GET responds with a filtered list of topics when a search_term query is used', () => request.get('/api/topics?search_term=mitch').expect(200).then((res) => {
      expect(res.body.topics[0].topic_slug).to.equal('mitch');
    }));
    it('POST adds a new topic object to the database and responds with said topic object and a status of 201', () => request.post('/api/topics')
      .send({ topic_slug: 'topic', topic_description: 'new topic' }).expect(201).then((res) => {
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
        expect(res.body.articles[0]).to.have.all.keys('article_id', 'article_title', 'article_votes', 'article_body', 'article_topic', 'article_created_by', 'article_created_at', 'comment_count');
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
          expect(res.body.newArticle).to.have.all.keys('article_id', 'article_title', 'article_body', 'article_topic', 'article_created_by', 'article_created_at', 'comment_count', 'article_votes');
          expect(res.body.newArticle.article_title).to.equal('new article');
          expect(res.body.newArticle.article_created_by).to.equal(1);
        }));
      it('POST responds with a status of 400 when the topic object is not in the correct format', () => request.post('/api/topics/mitch/articles')
        .send({ bad: 'request' }).expect(400).then((res) => {
          expect(res.body.msg).to.equal('Bad request');
        }));
      it('POST responds with a status of 404 when the topic parameter doesn\'t exist', () => request.post('/api/topics/iamnotatopicandhopefullyneverwillbebecausethatwouldbreakthistest/articles')
        .send({ article_title: 'new article', article_body: 'article content goes here', article_created_by: 1 }).expect(404).then((res) => {
          expect(res.body.msg).to.equal('Not found');
        }));
    });
  });
  describe('/articles', () => {
    it('GET will return with a list of all articles', () => request.get('/api/articles').expect(200).then((res) => {
      expect(res.body.articles).to.have.length(10);
      expect(res.body.articles[0]).to.have.all.keys('article_id', 'article_topic', 'article_title', 'article_body', 'article_created_by', 'article_created_at', 'article_votes', 'comment_count');
    }));
    it('GET responds with an array of articles limitted by a limit query', () => request.get('/api/articles?limit=1').expect(200).then((res) => {
      expect(res.body.articles).to.have.length(1);
    }));
    it('GET responds with an array of articles in descending when direction query is "desc"', () => request.get('/api/articles?direction=desc').expect(200).then((res) => {
      const firstLetter = res.body.articles[0].article_title[0].charCodeAt();
      const secondLetter = res.body.articles[9].article_title[0].charCodeAt();
      expect(firstLetter).to.be.greaterThan(secondLetter);
    }));
    it('GET responds with an array of articles in ascending when direction query is "asc"', () => request.get('/api/articles?direction=asc').expect(200).then((res) => {
      const firstLetter = res.body.articles[9].article_title[0].charCodeAt();
      const secondLetter = res.body.articles[0].article_title[0].charCodeAt();
      expect(firstLetter).to.be.greaterThan(secondLetter);
    }));
    it('GET responds with an array of articles ordered by article_id when orderBy query is "article_id"', () => request.get('/api/articles?order_by=article_id').expect(200).then((res) => {
      const firstId = res.body.articles[0].article_id;
      const secondId = res.body.articles[1].article_id;
      expect(secondId).to.be.greaterThan(firstId);
    }));
    it('GET responds with a filtered list of articles when a search_term query is used. The search term is sanitised', () => request.get('/api/articles?search_term=manchester;--').expect(200).then((res) => {
      expect(res.body.articles[0].article_title).to.equal('Seven inspirational thought leaders from Manchester UK');
    }));
    it('GET responds with a list of articles with an offset defined by a page no: p query multiplied by the limit query', () => request.get('/api/articles?p=1&limit=10&order_by=article_id').expect(200).then((res) => {
      expect(res.body.articles[0].article_id).to.equal(11);
    }));
    describe('/:article_id', () => {
      it('GET responds with an article with all the right properties', () => request.get('/api/articles/2').expect(200).then((res) => {
        expect(res.body.article[0]).to.have.all.keys('article_id', 'article_topic', 'article_title', 'article_body', 'article_created_by', 'article_created_at', 'article_votes', 'comment_count');
      }));
      it('GET responds with the article whose id corresponds to the article_id parameter', () => request.get('/api/articles/3').expect(200).then((res) => {
        expect(res.body.article[0].article_id).to.equal(3);
      }));
      it('GET responds with a 404 when the article_id does not correspond to any articles in the db', () => request.get('/api/articles/100').expect(404).then((res) => {
        expect(res.body.msg).to.equal('Article not found');
      }));
      it('PATCH will accept an object like { inc_votes: 1 } and update the votes property of the selected article with the inc_votes value', () => request.patch('/api/articles/1')
        .send({ inc_votes: 1 }).expect(202).then((res) => {
          expect(res.body.msg).to.equal('Article updated');
          return request.get('/api/articles/1').then((response) => {
            expect(response.body.article[0].article_votes).to.equal(1);
          });
        }));
      it('PATCH will respond with a 400 id the inc_votes object is in the wrong format', () => request.patch('/api/articles/1')
        .send({ wrong_format: 'ive been a bad boy' }).expect(400).then((res) => {
          expect(res.body.msg).to.equal('Bad request');
        }));
      it('PATCH responds with a 404 when the article_id does not correspond to any articles in the db', () => request.patch('/api/articles/100')
        .send({ inc_votes: 1 }).expect(404).then((res) => {
          expect(res.body.msg).to.equal('Article not found');
        }));
      it('DELETE deletes the specified article and responds with a 204 status and therefore an empty body', () => request.delete('/api/articles/1').expect(204).then((res) => {
        expect(res.body).to.eql({});
        return request.get('/api/articles/1').expect(404).then((response) => {
          expect(response.body.msg).to.equal('Article not found');
        });
      }));
      describe.only('/comments', () => {
        it('GET responds with comment(s) with all the correct properties', () => request.get('/api/articles/1/comments').expect(200).then((res) => {
          expect(res.body.comments[0]).to.have.all.keys('comment_id', 'comment_votes', 'comment_created_by', 'comment_created_at', 'comment_body', 'comment_belongs_to');
        }));
        it('GET responds with all the comments that correspond to a particular article_id', () => request.get('/api/articles/9/comments').expect(200).then((res) => {
          expect(res.body.comments).to.have.length(1);
        }));
        it('GET responds with an array of comments limited by the limit query', () => request.get('/api/articles/1/comments?limit=1').expect(200).then((res) => {
          expect(res.body.comments.length).to.equal(1);
        }));
        it('GET responds with an array of comments sorted by the sort_by query', () => request.get('/api/articles/1/comments?order_by=comment_id').expect(200).then((res) => {
          expect(res.body.comments[0].comment_id).to.equal(1);
        }));
        it('GET responds with an array of comments with an offset defined by a page no: p query multiplied by the limit query', () => request.get('/api/articles/1/comments?order_by=comment_id&p=1&limit=5').expect(200).then((res) => {
          expect(res.body.comments[0].comment_id).to.equal(6);
        }));
        it('GET responds with an array of comments with an offset defined by a page no: p query multiplied by the limit query (no need to specify the limit query explicitly)', () => request.get('/api/articles/1/comments?order_by=comment_id&p=1').expect(200).then((res) => {
          expect(res.body.comments[0].comment_id).to.equal(11);
        }));
        it('GET responds with an array of comments sorted either in ascending order or descending (defaults to ascending)', () => request.get('/api/articles/1/comments?direction=desc').expect(200).then((res) => {
          expect(res.body.comments[0].comment_id).to.equal(15);
        }));
        it('GET responds with status 404 when the article does not exist', () => request.get('/api/articles/100/comments').expect(404).then((res) => {
          expect(res.body.msg).to.equal('Article not found');
        }));
      });
    });
  });
});
