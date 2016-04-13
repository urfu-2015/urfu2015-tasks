const fs = require('fs');
const path = require('path');

const got = require('got');
const token = fs.readFileSync(path.join(__dirname, '..', 'key.txt'), {encoding: 'utf-8'}).trim();

const requestOptions = {json: true};

exports.getRepos = org => {
    return got(`https://api.github.com/orgs/${org}/repos?per_page=100&access_token=${token}`, requestOptions)
        .then(response => response.body);
};

exports.getRepo = (org, task) => {
    return got(`https://api.github.com/repos/${org}/${task}?per_page=100&access_token=${token}`, requestOptions)
        .then(response => response.body);
};

exports.getRepoReadme = (org, task) => {
    return got(`https://api.github.com/repos/${org}/${task}/readme?per_page=100&access_token=${token}`, requestOptions)
        .then(response => response.body);
};
