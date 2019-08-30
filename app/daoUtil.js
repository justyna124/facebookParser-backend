'use strict';

const elasticsearch = require('elasticsearch');
const date = require('date-and-time');
const {parse} = require('comment-json');


const config = require('./config');
const es = new elasticsearch.Client({...config.es.options});


function getElasticSearchClient() {
    return es;
}

async function addData(index, data, type) {

    typeof (data) !== "object" ? data = parse(data) : data;

    let indexName = index || config.es.index;
    let body = {...data};
    body.date = date.parse(body.date, 'DD.MM.YYYY, HH:mm');
    return await es.index({index: indexName, type: type, body: body})
        .then(response => response.result);
}

async function checkInDb(index, type, id) {

    let indexName = index || config.es.index;

    let body = {query: {match_phrase_prefix: {"id": id}}};
    return await es.search({index: indexName, type: type, body: body})
        .then(result => result.hits.total.value)
        .catch(err => err.statusCode);
}

async function createIndex(index) {
    return await es.indices.create({index});
}

function getAllData(index, pathVariable) {
    let indexName = index || config.es.index;
    let size = 10;
    let skip = (pathVariable - 1) * size;
    let body = {size: size, from: skip, query: {match_all: {}}, sort: [{"date": "desc"}]};
    return es.search({index: indexName, body: body})
        .then(result => result.hits);
}

function getLastAdded(index) {
    let indexName = index || config.es.index;

    let body = {size: 1, _source: ["id"], query: {match_all: {}}, sort: [{"date": "desc"}]};
    return es.search({index: indexName, body: body})
        .then(result => result.hits.hits[0]._source.id);
}

function getLastCorrectlyReceived(index) {

    let indexName = index || config.es.index;
    indexName = `${indexName}-last-correct`;

    let body = {_source: ["id"], query: {match_all: {}}};
    return es.search({index: indexName, body: body})
        .then(result => result.hits.hits[0]._source.id);
}

function lastCorrectlyReceived(index, id) {
    let indexName = index || config.es.index;
    indexName = `${indexName}-last-correct`;

    return es.index({index: indexName, type: 'id', id: 'lastCorrect', body: {"id": id}});
}

module.exports = {
    addData,
    checkInDb,
    getAllData,
    getLastAdded,
    getLastCorrectlyReceived,
    lastCorrectlyReceived
};
