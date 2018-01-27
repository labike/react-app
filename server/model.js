const mongoose = require('mongoose')


const DB_URL = 'mongodb://localhost:27017/react-app';
mongoose.connect(DB_URL);


const models = {
    user: {
        'user': {type: String, 'require': true},
        'pwd': {type: String, 'require': true},
        'type': {'type': String, 'require': true},
        'avatar': {'type': String},
        'desc': {'type': String},
        'title': {'type': String},
        'company': {'type': String},
        'money': {'type': String}
    },
    chat: {
        'chatid': {'type': String, 'require': true},
        'from': {'type': String, 'require': true},
        'to': {'type': String, 'require': true},
        'read': {'type': Boolean, 'default': false},
        'content': {'type': String, 'require': true, defualt: ''},
        'create_time': {'type': Number, 'default': new Date().getTime()}
    }
}

for(let item in models){
    mongoose.model(item, new mongoose.Schema(models[item]))
}

module.exports = {
    getModel: function(name){
        return mongoose.model(name)
    }
}

// mongoose.connection.on('connected', function(){
//     console.log('mongo connect sucessfully!')
// })