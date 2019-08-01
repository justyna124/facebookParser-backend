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
            let body = {size: 50, query: {match_all: {}}};
            return daoUtil.getAllData(index, body);
        }
    });

    server.route({
        method: 'POST',
        path: '/',
        handler(response, h) {
            return daoUtil.addData(response.payload, 'data');
        }
    });

    return server;
}

module.exports = createServer;