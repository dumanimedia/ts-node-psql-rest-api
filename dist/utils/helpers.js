import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export const hashPassword = (password) => bcrypt.hash(password, 10);
export const checkPassword = (inputPassword, hashedPassword) => bcrypt.compare(inputPassword, hashedPassword);
export const generateToken = (res, userInfo) => {
    let token = jwt.sign({ ...userInfo }, process.env.JWT_SECRET, {
        expiresIn: '3d',
    });
    res.cookie('ts-node', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
    });
};
export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
