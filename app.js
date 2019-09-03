let express = require('express');
// let bodyParser = require('body-parser');
let ejs = require('ejs');
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;

let app = express();

// declare global variable
let db = null;
let col = null;
let url = 'mongodb://localhost:27017';

// connect mongodb
mongoClient.connect(url,{useNewUrlParser:true , useUnifiedTopology:true },function(err,client) {
    db = client.db('w6lab');
    col = db.collection('tasks')

    // test 
    // col.insertOne({taskName:'FIT2095',assignTo:'Wei'});
})

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

app.get('/listTasks', function(req,res) {
    col.find({}).toArray(function(err,data) {
        res.render(viewPaths + '/listTasks.html', {
            task : data
        });
    });
});

app.get('/newTask', function(req,res) {
    res.sendFile(viewPaths + '/newTask.html');
});

app.get('/deleteTask', function(req,res) {
    res.sendFile(viewPaths + '/deleteTask.html');
});

app.get('/deleteCompleted', function(req,res) {
    res.sendFile(viewPaths + '/deleteCompleted.html');
})

app.get('/update', function(req,res) {
    res.sendFile(viewPaths + '/update.html');
})

// listen to action '/incomingTask' from newTask.html
// catch data input by clients and return static list task page
app.post('/incomingTask', function(req,res) {
    col.insertOne(req.body);
    res.redirect('/')
});


// listen to action '/deleteById' from deleteTask.html
// delete data with equivalent ID from database
app.post('/deleteById', function(req,res) {
    // check id and delete
    // NEED ATTENTION!
    console.log(req.body.id);
    col.deleteOne({_id:{$eq: req.body.id }},function(err,obj) {
        console.log(obj.result);
    })
    res.redirect('/listTasks');
})

// listen to action '/removeDone' from deleteCompleted.html
// delete all completed tasks
app.post('/removeDone', function(req,res) {
    query = {taskStatus : { $eq : "Complete" }};
    col.deleteMany({query}, function(err,obj) {
        console.log(obj.result);
    })
    res.redirect('/listTasks');
});

// listen to action '/updateTask' from update.html
// find the id 
// update the status
app.post('/updateTask', function(req,res) {
    query = {_id : {$eq: req.body.id}};
    col.updateOne({query},{$set : {taskStatus:req.body.status}}, {upsert:false},function(err, result) {
        console.log(result);
    })
    res.redirect('/listTasks');
});


app.listen(8080);
