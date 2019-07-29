'use strict';

const elasticsearch = require('elasticsearch');

const config = require('./config');
const mapping = require('./mapping.json');

const es = new elasticsearch.Client({...config.es.options});

function getElasticSearchClient() {
    return es;
}

async function createIndex(index) {
    await es.indices.create({index});
    console.info("Index create");
}

function getAllData(index, body) {
    return es.search({index: index, body: body})
        .then(result => result.hits);
}


module.exports = {
    createIndex,
    getElasticSearchClient,
    getAllData,
};