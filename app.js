const path = require('path');

const express = require('express');
const config = require('config');
const logger = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', (process.env.PORT || config.get('server.port')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(routes);

if (app.get('env') === 'development') {
    /* eslint no-unused-vars: 0 */
    /* eslint no-console: 0 */
    /* eslint no-empty: 0 */
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/* eslint no-unused-vars: 0 */
/* eslint no-console: 0 */
/* eslint no-empty: 0 */
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
