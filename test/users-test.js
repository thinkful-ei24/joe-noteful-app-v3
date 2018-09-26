const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_MONGODB_URI } = require('../config');

const User = require('../models/user');

const expect = chai.expect;

chai.use(chaiHttp);

describe.only('Noteful API - Users', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const fullName = 'Example User';

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return User.createIndexes();
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });
  
  describe('/api/users', function () {
    describe('POST', function () {
      it('Should create a new user', function () {
        const testUser = { username, password, fullName };

        let res;
        return chai
          .request(app)
          .post('/api/users')
          .send(testUser)
          .then(_res => {
            res = _res;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('id', 'username', 'fullName');

            expect(res.body.id).to.exist;
            expect(res.body.username).to.equal(testUser.username);
            expect(res.body.fullName).to.equal(testUser.fullName);

            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.exist;
            expect(user.id).to.equal(res.body.id);
            expect(user.fullName).to.equal(testUser.fullName);
            return user.validatePassword(password);
          })
          .then(isValid => {
            expect(isValid).to.be.true;
          });
      });
      it('Should reject users with missing username', function () {
        const testUser = { password, fullName };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            /**
             * CREATE YOUR ASSERTIONS HERE
             */

          });
      });

      /**
       * COMPLETE ALL THE FOLLOWING TESTS
       */
      it('Should reject users with missing password', function() {
        const testUser = { username, fullName};
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });

      it('Should reject users with non-string username', function() {
        const testUser = {username: 1, password, fullName};

        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with non-string password', function() {
        const testUser = {username, password: 1, fullName};

        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with non-trimmed username', function() {
        const testUser = {username: ' Woah', password, fullName};

        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with non-trimmed password',function() {
        const testUser = {username, password: ' woah', fullName};

        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with empty username', function() {
        const testUser = {username: '', password, fullName};

        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with password less than 8 characters', function() {
        const testUser = {username, password: 'woah', fullName};

        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with password greater than 72 characters', function() {
        const longPassword = 'gyvop0fidgl19fs87w5t24exmla4ads92hb6w66u2ccrd6inctp2qcv3qfreyqlki6hrevy1lu';
        const testUser = {username, password: longPassword, fullName};

        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });
      
      it('Should reject users with duplicate username');
      it('Should trim fullName');
    });
  });
});
