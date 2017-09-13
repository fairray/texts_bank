process.env.NODE_ENV = "test";
const app = require('./../app.js');
const db = require('./../models');
const supertest = require('supertest');
const expect = require('chai').expect;
const should = require('chai').should();
const apiBase = '/api/users/'
describe('Auth tests', function() {
    // start with a fresh DB 
    before(done => {
        db.sequelize.sync({
                force: true,
                match: /_test$/,
                logging: false
            })
            .then(() => {
                done()
            })

    })
    it('Signup request ', function(done) {
        const user = {
            email: 'test@test.com',
            password: '1'
        }
        supertest(app)
            .post(apiBase + 'signup')
            .send(user)
            .end(function(err, res) {
                db.User.findOne({ where: { email: user.email } }).then((dbUser) => {
                    should.exist(dbUser);
                    dbUser.should.be.an('object');
                    expect(dbUser.email).to.equal(user.email);
                    done();
                }).catch(err => {
                    done(err);
                })
            })
    })
    it('Signup request with exists user email', function(done) {
        const user = {
            email: 'test@test.com',
            password: '1'
        }
        supertest(app)
            .post(apiBase + 'signup')
            .send(user)
            .end(function(err, res) {
                res.status.should.equal(422);
                res.body.success.should.equal(false);
                res.body.message.should.a("string");
                done();
            })
    })
    it('Signup request with wrong user email', function(done) {
        const user = {
            email: 'test',
            password: '1'
        }
        supertest(app)
            .post(apiBase + 'signup')
            .send(user)
            .end(function(err, res) {
                res.status.should.equal(422);
                res.body.success.should.equal(false);
                res.body.message.should.a("string");
                done();
            })
    })
    it('Signup request with empty user creds', function(done) {
        const user = {
            email: '',
            password: ''
        }
        supertest(app)
            .post(apiBase + 'signup')
            .send(user)
            .end(function(err, res) {
                res.status.should.equal(422);
                res.body.success.should.equal(false);
                res.body.message.should.a("string");
                done();
            })
    })
    it('Signup request with empty post object', function(done) {
        const user = {}
        supertest(app)
            .post(apiBase + 'signup')
            .send(user)
            .end(function(err, res) {
                res.status.should.equal(422);
                res.body.success.should.equal(false);
                res.body.message.should.a("string");
                done();
            })
    })
    it('SignIn request ', function(done) {
        const user = {
            email: 'test@test.com',
            password: '1'
        }
        supertest(app)
            .post(apiBase + 'signin')
            .send(user)
            .end(function(err, res) {
                res.status.should.equal(200);
                res.body.success.should.equal(true);
                res.body.token.should.a("string");
                done();
            })
    })
    it('SignIn request with wrong pass', function(done) {
        const user = {
            email: 'test@test.com',
            password: 'wrong password'
        }
        supertest(app)
            .post(apiBase + 'signin')
            .send(user)
            .end(function(err, res) {
                res.status.should.equal(401);
                res.body.success.should.equal(false);
                done();
            })
    })
    it('SignIn request with email', function(done) {
        const user = {
            email: 'test1@test.com',
            password: 'wrong password'
        }
        supertest(app)
            .post(apiBase + 'signin')
            .send(user)
            .end(function(err, res) {
                res.status.should.equal(401);
                res.body.success.should.equal(false);
                done();
            })
    })
})