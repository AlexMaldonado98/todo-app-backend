const loginRouter = require('express').Router();
const config = require('../utils/config');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/',async (req,res,next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const exitsPassword = user !== null ? await bcrypt.compare(password,user.password) : false;
        if(!(user && exitsPassword)){
            return res.status(400).json({ error: 'the username or password is incorrect.' });
        }
        const tokenInfo = {
            username : user.username,
            id: user._id
        };
        const token = await jwt.sign(tokenInfo,config.SECRET_JWT,{ expiresIn: 60 * 60 * 24 });
        res.status(200).send({ token,username:user.username});
    } catch (error) {
        next(error);
    }
});

module.exports = loginRouter;
