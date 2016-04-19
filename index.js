require('debug-http')();
if (process.env.DEMO || process.env.RECORD) {
    require('./mock-requests');
}

const app = require('./app.js');

app.listen(app.get('port'),
    () => console.log(`Listening on port ${app.get('port')}`));
