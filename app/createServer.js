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
        path: '/savePosts/{groupId}',
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
        path: '/allData/{groupId}/{pageNumber}',

        handler(request, h) {
            return daoUtil.getAllData(request.params.groupId, request.params.pageNumber);
        }
    });
    server.route({
        method: 'GET',
        path: '/lastPostInContainer/{indexName}',

        handler(request, h) {
            return daoUtil.getLastAdded(request.params.indexName);
        }
    });
    server.route({
        method: 'GET',
        path: '/lastCorrectReceivedId/{indexName}',

        handler(request, h) {
            return daoUtil.getLastCorrectlyReceived(request.params.indexName);
        }
    });
    return server;
}

module.exports = createServer;
