import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET;
export function generateToken(userId, res) {
    const token = jwt.sign(userId, SECRET_KEY, {
        expiresIn: '3d',
    });
    res.cookie('ts-node', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
    });
}
//# sourceMappingURL=generateToken.js.map