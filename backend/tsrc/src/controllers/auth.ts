import bcrypt from 'bcryptjs';
import e, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
// import jwt from '../utils/jwt';
import { PrismaClient } from '@prisma/client';

export class AuthController {
    private db: PrismaClient;

    constructor(db: PrismaClient){
        this.db = db
    }
    
    async authenticate(req: Request, res: Response, next: NextFunction) {
        let { email, password } = req.body;

        if (!email || !password) {
        return next({
            status: StatusCodes.BAD_REQUEST,
            message: 'Some required fields are missing',
        });
        }

        const user = await this.db.user.findUnique({ where: { email } });

        if (!user) {
        return next({
            status: StatusCodes.NOT_FOUND,
            message: 'User not found',
        });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
        return next({
            status: StatusCodes.UNAUTHORIZED,
            message: 'Invalid password',
        });
        }

        // const token = jwt.sign({ id: user.id, email: user.email });

        res.status(StatusCodes.OK).json({ token });
    }
}