'use strict';

var dotenv = require('dotenv').config({path: '.env.test'});
var request = require('supertest');
var server = require('../app.js');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

var NODE_ENV = process.env.NODE_ENV;
var NODE_PORT = process.env.PORT;

describe('Route tests', function() {

    describe('GET Deployment', function() {
        it('should render Deployment page', function(done) {
            request(server)
                .get('/deployment')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });
    });

    describe('Test 404 error', function() {
        it('should return a 404 error', function(done) {
            request(server)
                .get('/asdfsad')
                .expect('Content-Type', /html/)
                .expect(404, done);
        });
    });

    describe('Test 500 error', function() {
        it('should return an Internal Server Error (500)', function(done) {
            request(server)
                .get('/.testext')
                .expect('Content-Type', /html/)
                .expect(500, done);
        });
    });
});
