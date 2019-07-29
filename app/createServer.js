const hapi = require('@hapi/hapi');

const daoUtil = require('./daoUtil');

const index = 'fbparsertest';

async function createServer() {
    const server = await new hapi.Server({
        port: process.env.PORT || 3000,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',

        handler() {
            let body = {size: 20, query: {match_all: {}}};
            return daoUtil.getAllData(index, body);
        }
    });

    server.route({
        method: 'POST',
        path: '/',
        handler(response, h) {
            console.log(response.payload);
            return daoUtil.getElasticSearchClient().index({index: index, type: 'data', body: response.payload})
        }
    });
    return server;
}

module.exports = createServer;