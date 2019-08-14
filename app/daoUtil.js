'use strict';

const elasticsearch = require('elasticsearch');
const date = require('date-and-time');
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
    body.date = date.parse(body.date, 'DD.MM.YYYY, HH:mm');
    return await es.index({index: index, type: type, body: body})
        .then(response => response.result);

}

async function createIndex(index) {
    return await es.indices.create({index});

}

function getAllData(index, pathVariable) {
    let size = 10;
    let skip = (pathVariable - 1) * size;
    let body = {size: size, from: skip, query: {match_all: {}}, sort: [{"date": "desc"}]};
    return es.search({index: index, body: body})
        .then(result => result.hits);
}

function getLastAdded() {
    let body = {size: 1, _source: ["id"], query: {match_all: {}}, sort: [{"date": "desc"}]};
    return es.search({index: index, body: body})
        .then(result => result.hits.hits[0]._source.id);

}


module.exports = {
    addData,
    getLastAdded,
    getAllData,
};