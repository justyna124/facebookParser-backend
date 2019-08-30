const hapi = require('@hapi/hapi');
const daoUtil = require('./daoUtil');


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
        path: '/{groupId}',
        handler(request, h) {
            daoUtil.lastCorrectlyReceived(request.params.groupId, JSON.parse(request.payload).id);
            return daoUtil.checkInDb(request.params.groupId, 'data', JSON.parse(request.payload).id)
                .then(resp => {
                    if (resp === 404 || !resp) {
                        return daoUtil.addData(request.params.groupId, request.payload, 'data');
                    } else {
                        return null;
                    }
                });
        }
    });
    server.route({
        method: 'GET',
        path: '/all/{indexName}/{pathVariable}',

        handler(request, h) {
            return daoUtil.getAllData(request.params.indexName, request.params.pathVariable);
        }
    });
    server.route({
        method: 'GET',
        path: '/last/{indexName}',

        handler(request, h) {
            return daoUtil.getLastAdded(request.params.indexName);
        }
    });
    server.route({
        method: 'GET',
        path: '/lastCorrect/{indexName}',

        handler(request, h) {
            return daoUtil.getLastCorrectlyReceived(request.params.indexName);
        }
    });
    return server;
}

module.exports = createServer;
