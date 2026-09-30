import jwt from 'jsonwebtoken';

export const generateToken = user => {
    return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

export const verifyToken = token => {
    return jwt.verify(token, process.env.JWT_SECRET)
}