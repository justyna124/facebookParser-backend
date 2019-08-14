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
        path: '/all/{pathVariable}',

        handler(request,h) {
            return daoUtil.getAllData(index,request.params.pathVariable);
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