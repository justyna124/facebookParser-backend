'use strict';

const elasticsearch = require('elasticsearch');
const {parse} = require('comment-json');

const config = require('./config');

const es = new elasticsearch.Client({...config.es.options});

const index = 'fbparsertest';

function getElasticSearchClient() {
    return es;
}

async function addData(data, type) {

    typeof (data) !== "object" ? data = parse(data) : data;

    const body = {...data};
    delete body.id;

    return await es.index({index: index, type: type, id: data.id, body: body})
        .then(response => response.result);

}

async function createIndex(index) {
    await es.indices.create({index});
    console.info("Index create");
}

function getAllData(index, body) {
    return es.search({index: index, body: body})
        .then(result => result.hits)
        .catch(error => {
            if (500 === error.statusCode) {
                return {text: 'Index not created'}
            }
            throw error;
        });
}


module.exports = {
    addData,
    createIndex,
    getElasticSearchClient,
    getAllData,
};