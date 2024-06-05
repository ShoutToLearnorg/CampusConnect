const crypto = require('crypto');

function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
}

const secretKey = generateRandomString(64);
console.log(secretKey);
