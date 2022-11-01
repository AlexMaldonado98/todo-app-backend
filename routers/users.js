const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.post('/',async (req,res) => {
    const {username,password} = req.body;
    if(!(username && password)){
        return res.status(400).send({ error:'the password and username is required' });
    }
    const userExistent = await User.findOne({ username });
    if(userExistent){
        return res.status(400).json({ error: 'the username is in use' });
    }
    if(username.length < 3 || password.length < 3){
        return res.status(400).json({ error: 'username and password are too short: the minimum is 3 characters' });
    }
    const saltRounds = 10;
    const passwordWithHash = await bcrypt.hash(password,saltRounds);
    const newUser = new User({
        username: username,
        password: passwordWithHash
    });
    await newUser.save();
    res.status(201).json(newUser);
});

module.exports = userRouter;