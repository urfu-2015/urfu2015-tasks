'use strict';

const got = require('got');
const config = require('config');
const github = require('./github');

const Cache = require('../lib/cache');

const organization = config.get('organization');

const cache = new Cache();

function filterTasks(tasks, category) {
    return tasks.filter(task => {
        return task.name.indexOf(category + '-tasks') === 0;
    });
}

function getTasksInfo(tasks) {
    return tasks.map(task => {
        return {name: task.name, title: task.description};
    });
}

function downloadReadme(path) {
    return got(path)
        .then(response => response.body);
}

function getTaskInfo(task, readme) {
    return downloadReadme(readme.download_url)
        .then(readme => {
            return {
                title: task.description,
                readme: readme
            };
        });
}

let reposQuery;
function getRepositories() {
    if (!reposQuery) {
        reposQuery = github.getRepos(organization)
            .then(res => {
                reposQuery = null;
                return res;
            });
    }

    return reposQuery;
}

function getTasks(category) {
    return getRepositories()
        .then(tasks => filterTasks(tasks, category))
        .then(getTasksInfo);
}

exports.getTasks = category => {
    const cacheKey = `tasks.${category}`;

    return cache.memoize(cacheKey, 5 * 60, getTasks.bind(null, category));
};

exports.getTask = task => {
    return Promise
        .all([
            github.getRepo(organization, task),
            github.getRepoReadme(organization, task)
        ])
        .then(result => getTaskInfo(result[0], result[1]));
};
