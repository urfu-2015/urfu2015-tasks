const marked = require('marked');

const api = require('../api');

function getCategory(name) {
    return name.split('-').shift();
}

exports.list = (req, res, next) => {
    Promise
        .all([
            api.getTasks('javascript'),
            api.getTasks('verstka'),
            api.getTasks('webdev')
        ])
        .then(tasks => {
            res.render('index', {
                title: 'Задачки',
                categories: [
                    {
                        title: 'JavaScript',
                        tasks: tasks[0]
                    },
                    {
                        title: 'Verstka',
                        tasks: tasks[1]
                    },
                    {
                        title: 'WebDev',
                        tasks: tasks[2]
                    }
                ]
            });
        })
        .catch(next);
};

exports.item = (req, res, next) => {
    const name = req.params.name;
    const category = getCategory(name);

    Promise
        .all([
            api.getTask(name),
            api.getTasks(category)
        ])
        .then(result => {
            const task = result[0];
            const tasks = result[1];

            tasks.some(task => {
                if (task.name === name) {
                    task.active = true;
                    return true;
                }
                return false;
            });

            res.render('task', {
                title: task.title,
                text: marked(task.readme),
                tasks: tasks
            });
        })
        .catch(next);
};
