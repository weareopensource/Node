/**
 * Module dependencies
 */
import axios from 'axios';
import path from 'path';
import _ from 'lodash';
import { Base64 as base64 } from 'js-base64';
import { promises as fs } from 'fs';
import config from '../../../config';
import * as UserService from '../../users/services/user.service';
import team from '../repositories/home.repository';

/**
 * @desc Function to get all admin users in db
 * @return {Promise} All users
 */
export async function page(name) {
  const markdown = await fs.readFile(path.resolve(`./config/markdown/${name}.md`), 'utf8');
  const test = await fs.stat(path.resolve(`./config/markdown/${name}.md`));
  return Promise.resolve([{
    title: _.startCase(name),
    updatedAt: test.mtime,
    markdown,
  }]);
}

/**
 * @desc Function to get all versions
 */
export async function releases(): Promise<any[]> {
  const requests = config.repos.map((item) => axios.get(`https://api.github.com/repos/${item.owner}/${item.repo}/releases`, {
    headers: item.token ? { Authorization: `token ${item.token}` } : {},
  }));
  const results = await axios.all<any>(requests);
  return results.map((result, i) => ({
    title: config.repos[i].title,
    list: result.data.map((release) => ({
      name: release.name,
      prerelease: release.prerelease,
      published_at: release.published_at,
    })),
  }));
}

/**
 * @desc Function to get all changelogs
 * @return {Promise} All changelogs
 */
export async function changelogs() {
  const repos = _.filter<any>(config.repos, (repo) => repo.changelog);
  const requests = repos.map((item) => axios.get(`https://api.github.com/repos/${item.owner}/${item.repo}/contents/${item.changelog}`, {
    headers: item.token ? { Authorization: `token ${item.token}` } : {},
  }));
  let results = await axios.all<any>(requests);
  results = results.map((result, i) => ({
    title: config.repos[i].title,
    markdown: base64.decode(result.data.content),
  }));
  return Promise.resolve(results);
}

/**
 * @desc Function to get all admin users in db
 * @return {Promise} All users
 */
export async function homeTeam() {
  const result = await team();
  return Promise.resolve(result.map((user) => UserService.removeSensitive(user)));
}
