import bcrypt from 'bcryptjs';
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    return String(hashPassword);
}
//# sourceMappingURL=hashPassword.js.map