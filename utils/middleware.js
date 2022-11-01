const config = require('../utils/config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const tokenExtractor = (request,response,next) => {
    const authorization = request.get('authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer')){
        request.token = authorization.split(' ')[1];
    }
    next();
};

const userExtractor = async (request,response,next) => {
    try {
        const decryptionToken = jwt.verify(request.token,config.SECRET_JWT);
        if(!(decryptionToken.id && request.token)){
            return response.status(400).json({ error: 'token is invalid or is missing' });
        }
        request.user = await User.findById(decryptionToken.id);
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    tokenExtractor,
    userExtractor
};