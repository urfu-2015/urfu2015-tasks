const got = require('got');
const config = require('config');
const github = require('./github');

const organization = config.get('organization');

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

exports.getTasks = category => {
    return github.getRepos(organization)
        .then(tasks => filterTasks(tasks, category))
        .then(getTasksInfo);
};

exports.getTask = task => {
    return Promise
        .all([
            github.getRepo(organization, task),
            github.getRepoReadme(organization, task)
        ])
        .then(result => getTaskInfo(result[0], result[1]));
};
