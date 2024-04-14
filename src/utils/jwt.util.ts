

export function generateToken(payload: any, expiresIn: string = '1h'): string {
    return jwt.sign(payload, secretKey, { expiresIn });
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

export function decodeToken(token: string): any {
    try {
        return jwt.decode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}