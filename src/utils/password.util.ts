import argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
    try {
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            hashLength: 32, 
        });
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

export async function verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    try {
        const isPasswordValid = await argon2.verify(hashedPassword, plainPassword);
        return isPasswordValid;
    } catch (error) {
        throw new Error('Error verifying password');
    }
}
