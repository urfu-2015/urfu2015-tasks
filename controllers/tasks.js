exports.list = (req, res) => {
    res.render('index', {
        title: 'Задачки',
        categories: [
            {
                category: 'javascript',
                title: 'JavaScript',
                tasks: [
                    {name: 'javascript-tasks-5', title: "Задача к лекции «Node.js» – «Топ-10»"}
                ]
            },
            {
                category: 'webdev',
                title: 'WebDev',
                tasks: [
                    {name: 'webdev-tasks-5', title: "Задача к лекциям «REST» и «Touch» – «TODOхи»"}
                ]
            }
        ]
    });
};

exports.item = (req, res) => {
    res.render('task', {
        title: 'Задача к лекции «Node.js» – «Топ-10»',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, cupiditate doloribus ea incidunt iste iusto necessitatibus nemo odit omnis pariatur porro quae voluptatem. Illum itaque laborum magnam provident quam.'
    });
};
