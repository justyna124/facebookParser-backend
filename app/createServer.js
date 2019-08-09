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
        method: 'POST',
        path: '/',
        handler(response, h) {
            return daoUtil.addData(response.payload, 'data');
        }
    });
    server.route({
        method: 'GET',
        path: '/all',

        handler() {
            return daoUtil.getAllData(index);
        }
    });
    server.route({
        method: 'GET',
        path: '/last',

        handler() {
            return daoUtil.getLastAdded();
        }
    });

    return server;
}

module.exports = createServer;