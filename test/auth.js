process.env.NODE_ENV = "test";
const app = require('./../server/app.js');
const db = require('./../server/models');
const supertest = require('supertest');
const expect = require('chai').expect;
const should = require('chai').should();
const apiBase = '/api/users/'
describe('Auth', function () {
    // start with a fresh DB 
    beforeEach(done => {
        db.sequelize.sync({
                force: true,
                match: /_test$/,
                logging: false
            })
            .then(() => {
                done()
            })

    })
    it('sign up req', function (done) {
        const user = {
            email: 'test@test.com',
            password: '1'
        }
        supertest(app)
        .post(apiBase + 'signup')
        .send(user)
        .end(function(err, res){
            db.User.findOne({where: {email:user.email}}).then((dbUser)=>{
                should.exist(dbUser);
                dbUser.should.be.an('object');
                expect(dbUser.email).to.equal(user.email);
                done();
            }).catch(err=>{
                done(err);
            })
        })
    })
})