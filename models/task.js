const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    text:String,
    complete:Boolean,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

taskSchema.set('toJSON',{
    transform: (document,returnObject) => {
        returnObject.id = returnObject._id;
        delete returnObject._id;
        delete returnObject.__v;
    }
});

module.exports = mongoose.model('Task',taskSchema);