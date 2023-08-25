import jwt from 'jsonwebtoken';
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
