let express = require('express');
// let bodyParser = require('body-parser');
let ejs = require('ejs');

let app = express();
let db = [];

// initialise local path to access files from different folders
let viewPaths = __dirname + '/public';

// configure express to handle machine
// tell express wherever in html, run this machine
app.engine('html',ejs.renderFile);
app.set('view engine','html');

// parse application
// generate the middleware
app.use(express.urlencoded({
    extended:false
}));

// tells express which file to look for static assets
app.use(express.static('img'));
app.use(express.static('css'));

// check pathname and return static homepage
app.get('/', function(req,res) {
    res.sendFile(viewPaths + '/index.html');
});

// check pathname and return dynamic list tasks page
app.get('/listTasks', function(req,res) {
    res.render(viewPaths + '/listTasks.html', {
        task : db 
    })
});

// check pathname and return static page with forms to take input from clients
app.get('/newTask', function(req,res) {
    res.sendFile(viewPaths + '/newTask.html')
});

// listen to action '/incomingTask'
// catch data input by clients and return static list task page
app.post('/incomingTask', function(req,res) {
    console.log(req.body);
    db.push(req.body);
    // console.log(db);
    res.render(viewPaths + '/listTasks.html', { task : db });
});

app.listen(8080);
