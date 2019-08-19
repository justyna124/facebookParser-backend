'use strict';

const createServer = require('./createServer');


(async () => {
    const server = await createServer();
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
})();
