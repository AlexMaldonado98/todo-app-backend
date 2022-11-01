require('dotenv').config();
const PORT = process.env.PORT;
const SECRET_JWT = process.env.SECRET_JWT;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
    PORT,
    SECRET_JWT,
    MONGODB_URI
};