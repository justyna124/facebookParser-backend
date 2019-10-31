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
    path: '/post',
    handler(request) {
      return daoUtil.addData(request.payload);
    }
  });
  server.route({
    method: 'GET',
    path: '/lastParsedPost/{groupId}',
    handler(request) {
      return daoUtil.getLastParsedPost(request.params.groupId);
    }
  });
  server.route({
    method: 'POST',
    path: '/lastParsedPost',
    handler(request) {
      return daoUtil.saveLastParsedPost(request.payload);
    }
  });
  // Todo: add endpoints and function in daoUtil for search
  return server;
}

module.exports = createServer;
