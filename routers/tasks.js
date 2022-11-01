const taskRouter = require('express').Router();
const Task = require('../models/task');
const middleware = require('../utils/middleware');

/* taskRouter.get('/', async (req, res) => {
    const tasks = await Task.find({}).populate('user',{ username:1});
    res.json(tasks);
}); */

taskRouter.get('/',middleware.userExtractor, async (req, res) => {
    const tasks = await Task.find({user:req.user._id}).populate('user',{ username:1, name:1 });
    res.json(tasks);
});

taskRouter.post('/',middleware.userExtractor,async (request, response,next) => {

    try{
        const task = request.body;
        const user = request.user;

        const newTask = await new Task({
            text: task.text || 'ERROR SYSTEM SERVER',
            complete: task.complete || false,
            user: user._id
        }).populate('user',{ username:1,tasks:1});

        const result = await newTask.save();
        user.tasks = user.tasks.concat(result._id);
        await user.save();
        response.status(201).json(result);
    }catch(error){
        next(error);
    }
});

taskRouter.delete('/:id',middleware.userExtractor,async (request,response,next) => {
    try {
        const { id } = request.params;
        const user = request.user;
        const taskToDelate = await Task.findById(id);
        if(taskToDelate === null){
            return response.status(404).json({ error: 'the blog does not exist' });
        }
        if(taskToDelate.user.toString() === user._id.toString()){
            await Task.deleteOne({ _id: id });
            response.status(204).end();
        }else{
            response.status(401).json({ error: 'unauthorized operation' });
        }
    } catch (error) {
        next(error);
    }
});

taskRouter.put('/:id',middleware.userExtractor,async (request,response,next) => {
    try {
        const { id } = request.params;
        const user = request.user;
        const taskToUpdate = await Task.findById(id);
        if(taskToUpdate === null){
            return response.status(404).json({ error: 'the blog does not exist' });
        }
        if(taskToUpdate.user.toString() === user._id.toString()){
            const task = request.body;
            const updatedtask = await Task.findOneAndUpdate(taskToUpdate._id,task,{new:true}).populate('user',{username:1});
            response.status(200).send(updatedtask);
        }else{
            response.status(401).json({ error: 'unauthorized operation' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = taskRouter;