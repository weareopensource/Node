/**
 * Module dependencies
 */
const axios = require('axios');
const path = require('path');

const config = require(path.resolve('./config'));
/**
 * @desc Function to get all versions
 * @return {Promise} All versions
 */
exports.releases = async () => {
  const requests = config.repos.map((item) => axios.get(`https://api.github.com/repos/${item.owner}/${item.repo}/releases`, {
    headers: item.token ? { Authorization: `token ${item.token}` } : {},
  }));
  let results = await axios.all(requests);
  results = results.map((result, i) => ({
    title: config.repos[i].title,
    list: result.data.map((release) => ({
      name: release.name,
      prerelease: release.prerelease,
      published_at: release.published_at,
    })),
  }));
  return Promise.resolve(results);
};

/**
 * @desc Function to get all changelogs
 * @return {Promise} All changelogs
 */
exports.changelogs = async () => {
  const requests = config.repos.map((item) => axios.get(`https://api.github.com/repos/${item.owner}/${item.repo}/contents/${item.changelog}`, {
    headers: item.token ? { Authorization: `token ${item.token}` } : {},
  }));
  let results = await axios.all(requests);
  results = results.map((result, i) => ({
    title: config.repos[i].title,
    data: {
      type: result.data.type,
      size: result.data.size,
      encoding: result.data.encoding,
      content: result.data.content,
    },
  }));
  return Promise.resolve(results);
};
