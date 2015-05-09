var path = require('path');

var express = require('express');
var jade = require('jade');
var i18n = require('i18n');
var bodyParser = require('body-parser');

var middleware = require('./src/middleware');
var Guillotine = require('./src/guillotine');
var common = require('./src/common');

var Rectangle = common.Rectangle;
var Slate = common.Slate;
var Part = common.Part;

i18n.configure({
    locales: ['en', 'bg'],
    directory: __dirname + '/locales'
});

var app = express();
global.lang = 'en';

app.set('views', `${__dirname}/views`);
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use('/dist', express.static(`${__dirname}/dist`));

app.use(i18n.init);

app.get('/', middleware.setLanguage, (req, res) => {
    res.render('main.jade');
});

app.post('/lang', (req, res) => {
    // TODO: use session instead of global
    global.lang = req.body.lang;
    res.status(200).end();
});

app.post('/cutlist', (req, res) => {
    var slate = new Slate(new Rectangle(0, 0, parseInt(req.body.slate.w), parseInt(req.body.slate.h)));
    var parts = [];
    req.body.parts.forEach((part) => {
        if (part.w && part.h) {
            parts.push(new Part(part.name, parseInt(part.w), parseInt(part.h), Boolean(part.canRotate)));
        }
    });

    var guillotine = new Guillotine(req.body.cutType);
    res.json(guillotine.apply(slate, parts));
});

var port = process.env.PORT || 31314;

console.log(`Server listening on ${port}.`);
app.listen(port);
