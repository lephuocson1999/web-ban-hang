var config = {};
// let uri = `mongodb://localhost/them_database`;

config.mongoURI = {
    development: 'mongodb://localhost:27017/webbanhang',
    test: 'mongodb://localhost/node-test'
}; 

module.exports = config;