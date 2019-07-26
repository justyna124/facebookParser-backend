const hapi = require('@hapi/hapi');

const postList = require('./DOM');

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
            return "GET"
        }
    });

    server.route({
        method: 'POST',
        path: '/',
        handler(response,h) {
            console.log(postList(response.payload));
            return "POST"
        }
    });
    return server;
}

module.exports = createServer;
