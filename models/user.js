const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password:String,
    tasks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Task'
        }
    ]
});

userSchema.set('toJSON',{
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id;

        delete returnObject._id;
        delete returnObject.__v;
        delete returnObject.passwordHash;
    }
});

module.exports = mongoose.model('User',userSchema);