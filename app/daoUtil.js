const elasticsearch = require('@elastic/elasticsearch');
const Promise = require('bluebird');

const config = require('./config');

const fbParser = new elasticsearch.Client({ ...config.es.options });

function checkIndexExist(index) {
  return fbParser.indices.exists({ index });
}

async function createIndex(index) {
  return await fbParser.indices.create({ index });
}

Promise.props({ // Todo: wait for es start
  index: checkIndexExist(config.es.index).then(result => result.body),
  lastParsedPostsIndex: checkIndexExist(config.es.lastParsedPostsIndex).then(result => result.body)
})
  .then(results => {
    if (!results.index) {
      console.log('Create main index...');
      createIndex(config.es.index).then(() => {
        console.info(`Index ${config.es.index} created`)
      });
    }
    if (!results.lastParsedPostsIndex) {
      console.log(`Create additional ${config.es.lastParsedPostsIndex} index...`);
      createIndex(config.es.lastParsedPostsIndex).then(() => {
        console.info(`Index ${config.es.lastParsedPostsIndex} created`)
      });
    }
  })
  .catch(e => {
    console.error(e);
  });

function addData(body, additionalParam) {
  const params = {
    index: config.es.index,
    type: 'data',
    body,
    ...additionalParam
  };
  return fbParser.index(params);
}

function saveLastParsedPost(body) {
  return addData(body)
    .then(() => {
      console.log(`Save: groupId: ${body.groupId} with postId: ${body.id}`);
      return fbParser.index({
        index: config.es.lastParsedPostsIndex,
        type: 'data',
        id: body.groupId,
        body: {
          postId: body.id
        }
      })
    });
}

function getLastParsedPost(groupId) {
  console.log('GroupID:', groupId);
  return fbParser.get({
    index: config.es.lastParsedPostsIndex,
    id: groupId
  })
    .then(data => {
      return data.body._source;
    })
    .catch(e => {
      console.error(e);
      if (404 === e.statusCode) {
        return null;
      }
      return e;
    });
}

module.exports = {
  addData,
  saveLastParsedPost,
  getLastParsedPost
};
