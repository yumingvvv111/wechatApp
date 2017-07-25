var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://tester:123456@localhost:27017/test', ['p6']);


var routerMap = {
    equipment: 'equimentRest/restEquiment/equiment/'
};



router.post('/restEquiment/*', function(req, res, next){
    // var param = mongojs.ObjectId(req.params.param);
    var param = req.params;
    var reqBody = req.body;
    var url = req.originalUrl;

    console.log(url);



    if(url.indexOf('/restEquiment/equiment/list') >= 0){
        db.p6.findOne({recordType: "equipmentList"}, function(err, data){
            if(err){
                res.send(err);
            }
            res.json(data.success);
        });
        return false;
    }


    if(url.indexOf('restEquiment/equiment/unbind') >= 0){
        res.json({
            "message": "Success",
            "data": {},
            "code": 0
        });
        return false;
    }

    db.p6.findOne({id: 1}, function(err, tasks){
        if(err){
            res.send(err);
        }
        if(reqBody.isAgree == 0){
            res.json(tasks.success);
        }else{
            res.json(tasks.error);
        }

    });
});



// Get All Tasks
router.get('/restEquiment/*', function(req, res, next){
    var reqBody = req.body;
    var url = req.originalUrl;

    if(url.indexOf('/restEquiment/pageToken/getCode') >= 0){
        res.json({
            "message": "Success",
            "data": {WXId: 'oOTfGjrnQYbzF7qDKyzK_SZh3qkw'},
            "code": 0
        });
        return false;
    }


    db.p6.findOne({id: '1'}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

// Get Single Task
router.get('/task/:id', function(req, res, next){
    db.p6.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

//Save Task
router.post('/task', function(req, res, next){
    var task = req.body;
    if(!task.title || !(task.isDone + '')){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.p6.save(task, function(err, task){
            if(err){
                res.send(err);
            }
            res.json(task);
        });
    }
});

// Delete Task
router.delete('/task/:id', function(req, res, next){
    db.p6.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

// Update Task
router.put('/task/:id', function(req, res, next){
    var task = req.body;
    var updTask = {};
    
    if(task.isDone){
        updTask.isDone = task.isDone;
    }
    
    if(task.title){
        updTask.title = task.title;
    }
    
    if(!updTask){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        db.p6.update({_id: mongojs.ObjectId(req.params.id)},updTask, {}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
    }
});

module.exports = router;