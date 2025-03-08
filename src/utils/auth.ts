import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { Permission } from '../models/User';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    if (!user.permissions.includes(Permission.Admin)) {
        return res.status(403).send('Access denied - Admin only');
    }
    next();
};

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied - No token');
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not found');
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err: any, user: any) => {
        if (err) {
            return res.status(403).send('Access denied - Invalid token');
        }
        const validUser = await User.findById(user._id);
        if (!validUser) {
            return res.status(404).send('Access denied - User not found');
        }
        req.body.user = validUser;
        next();
    });
};

export const generateToken = (userId: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not found');
    }
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};