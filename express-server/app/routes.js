var User = require('./models/user');

// 数据库增删查改
function addUser(req, res) {
    User.create({
        id: req.body.id,
        name: req.body.name,
        gender: req.body.gender,
        grade: req.body.grade,
        college: req.body.college,
        major: req.body.major,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        first_choice: req.body.first_choice,
        second_choice: req.body.second_choice,
        introduction: req.body.introduction,
        done: false
    }, function (err, users) {
        if (err) res.send(err); // 失败则返回错误信息
        // else getUsers(users); // 成功则返回查看列表
    });
}

function deleteUser(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function (err, users) {
        if (err) res.send(err); // 失败则返回错误信息
        // else getUsers(users); // 成功则返回查看列表
    });
}

function getUserById(req, res) {
    User.find({
        id: req.body.id
    }, function (err, users) {
        if (err) res.send(err); // 失败则返回错误信息
        else getUsers(users); // 成功则返回查看列表
    });
};

function getUsers(res) {
    User.find(function (err, users) {
        if (err) res.send(err); // 失败则返回错误信息
        else res.json(users); // 成功则返回查看列表
    });
};

function updateUser(req, res) {
    var whereId = {'_id': req.params.user_id};
    console.log('id: ' + whereId);
    var updateBody = req.body;
    console.log('body:' + updateBody);
    User.update(whereId, updateBody, function (err, users) {
        if (err) res.send(err); // 失败则返回错误信息
        // else getUsers(users); // 成功则返回特定用户
    });
};

// 暴露数据库接口
module.exports = function (app) {

    app.get('/api/users', function (req, res) {
        getUsers(res);
    });

    app.get('/api/users', function (req, res) {
        getUserById(req, res);
    });

    app.post('/api/users', function (req, res) {
        addUser(req, res);
    });

    app.put('/api/users/:user_id', function(req, res) {
        updateUser(req, res);
    });

    app.delete('/api/todos/:user_id', function (req, res) {
        deleteUser(req, res);
    });

    
    // load the single view file (angular will handle the page changes on the front-end)
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });
};
