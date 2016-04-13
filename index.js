require('debug-http')();

const app = require('./app.js');

app.listen(app.get('port'),
    () => console.log(`Listening on port ${app.get('port')}`));
