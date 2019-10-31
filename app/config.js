'use strict';
const Promise = require('bluebird');

module.exports = {
    es: {
        index: 'facebook-parser',
        lastParsedPostsIndex: 'facebook-parser-last-parsed-posts',
        options: {
            node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
            maxRetries: 5,
            requestTimeout: 60000,
            sniffOnStart: true
        },
        concurrentRequests: parseInt(process.env.ES_CONCURRENT_REQUESTS, 10) || 200
    },
    port: process.env.PORT || 3000
};
