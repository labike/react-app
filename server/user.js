const express = require('express')
const utils = require('utility')
const Router = express.Router()
const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')

const _filter = {'pwd': 0, '__v': 0}
// Chat.remove({}, function(e, d){
    
// })

Router.get('/list', function(req, res){
    //User.remove({}, function(e, d){})
    const { type } = req.query
    User.find({type}, function(err, doc){
        res.json({code: 0, data: doc})
    })
})

Router.get('/getmsglist', function(req, res){
    const user = req.cookies.userid
    User.find({}, function(e, userdoc){
        let users = {}
        userdoc.forEach(v => {
            users[v._id] = {name: v.user, avatar: v.avatar}
        })
        Chat.find({'$or': [{from: user}, {to: user}]}, function(err, doc){
            if(!err){
                return res.json({code: 0, msgs: doc, users: users})
            }
        })
    })
    //{'$or:[{from: user, to: user}]'}
    
})
Router.post('/readmsg', function(req, res){
    const userid = req.cookies.userid
    const {from} = req.body
    Chat.update(
        {from, to: userid}, 
        {'$set': {read: true}}, 
        {'multi': true}, 
        function(err, doc){
            //console.log(doc)
            if(!err){
                return res.json({code: 0, num: doc.nModified})
            }
            return res.json({code: 1, msg: '修改失败'})
    })
})
Router.post('/update', function(req, res){
    const userId = req.cookies.userId
    if(!userId){
        return json.dumps({code: 1})
    }
    const body = req.body
    User.findByIdAndUpdate(userId, body, function(err, doc){
        const data = Object.assign({}, {
            user: doc.user,
            type: doc.type
        }, body)
        return res.json({code: 0, data})
    })
})

Router.post('/login', function(req, res){
    const {user, pwd} = req.body
    User.findOne({user, pwd: md5Pwd(pwd)}, _filter, function(err, doc){
        if(!doc){
            return res.json({code: 1, msg: '用户名不存在或密码错误'})
        }
        res.cookie('userId', doc._id)
        return res.json({code: 0, data: doc})
    })  
})
Router.post('/register', function(req, res){
    console.log(req.body)
    const {user, pwd, type} = req.body
    User.findOne({user}, function(err, doc){
        if(doc){
            return res.json({code: 1, msg: '用户名已存在!'})
        }

        const userModel = new User({user, type, pwd: md5Pwd(pwd)})
        userModel.save(function(e, d){
            if(e){
                return res.json({code: 1, msg: '后端有错!'})
            }
            const {user, type, _id} = d
            res.cookie('userId', _id)
            return res.json({code: 0, data: {user, type, _id}})
        })
    })
})
Router.get('/info', function(req, res){
    //cookie
    const {userId} = req.cookies
    if(!userId){
        return res.json({code: 1})
    }
    User.findOne({_id: userId}, _filter, function(err, doc){
        if(err){
            return res.json({code: 1, msg: '后端有错!'})
        }
        if(doc){
            return res.json({code: 0, data: doc})
        }
    })
})

function md5Pwd(pwd){
    const salt = 'labike_is_good_s5$1#%d15rweqw[+]d12f3sdf&&SDASD'
    return utils.md5(utils.md5(pwd+salt))
}

module.exports = Router
