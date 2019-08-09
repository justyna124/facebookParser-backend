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

    let body = {...data};
    body.date = dateParse(body.date);
    return await es.index({index: index, type: type, body: body})
        .then(response => response.result);

}

async function createIndex(index) {
    await es.indices.create({index});
    return "Index create";
}

function getAllData(index) {
    let body = {size: 2000, query: {match_all: {}}, sort: [{"date": "desc"}]};
    return es.search({index: index, body: body})
        .then(result => result.hits);
}

function getLastAdded() {
    let body = {size: 1, _source: ["id"], query: {match_all: {}}, sort: [{"date": "desc"}]};
    return es.search({index: index, body: body})
        .then(result => result.hits.hits[0]._source.id);

}

function dateParse(dataString) {
    let parts = dataString.split('.');
    let temp = parts[0];
    parts[0] = parts[1];
    parts[1] = temp;
    let date = new Date(parts.join('.').toString());
    return date;
}


module.exports = {
    addData,
    getLastAdded,
    getAllData,
};