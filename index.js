require('debug-http')();
if (process.env.DEMO || process.env.RECORD) {
    require('./mock-requests');
}

const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const cpus = os.cpus().length;
    for (var i = 0; i < cpus; i++) {
        cluster.fork();
    }
} else {
    const app = require('./app.js');

    // setTimeout(function () {
    //    throw new Error('Ooops');
    // }, Math.ceil(Math.random() * 3) * 1000);

    app.listen(app.get('port'),
        () => console.log(`Listening on port ${app.get('port')}`));
}
