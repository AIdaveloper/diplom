import { Router } from "express";
import IDatabase from "../db/db";
import Utils from "../utils";
import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { string } from "yup";

export default class AuthApi {
    private router: Router;
    constructor(db: IDatabase, utils: Utils){
        this.router = Router()
        this.router.post('/register', async (req, res, next) => {
            try {
                const { name, email, password } = req.body;

                if (!name || !email || !password) {
                    return next({
                        status: StatusCodes.BAD_REQUEST,
                        message: 'Some required fields: {name, email, password} are missing',
                    })
                }

                if (!utils.isEmail(email)){
                    return next({
                      status: StatusCodes.BAD_REQUEST,
                      message: 'Email not valid.',
                    })
                }
            
                const existingUser = await db.userDataService.findUserByEmail(email);
            
                if (existingUser) {
                    return next({
                      status: StatusCodes.BAD_REQUEST,
                      message: 'Email already in use.',
                    })
                }
            
                const user = await db.userDataService.createUserByEmailAndPassword({ name, email, password });
                const _bot = await db.botDataService.createBot({account_id: user.account_id})
                const jti = uuidv4();
                const { accessToken, refreshToken } = utils.generateTokens(user, jti);
                await db.authDataService.addRefreshTokenToWhitelist({ jti, refreshToken, user_id: user.id });
            
                return res.json({
                  accessToken,
                  refreshToken,
                });
            } catch (err) {
              return next(err);
            }
        });
        this.router.post('/login', async (req, res, next) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {

                  return next({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'You must provide an email and a password.',
                  })
                  res.status(400);
                  throw new Error('You must provide an email and a password.');
                }
  
  
                if (!utils.isEmail(email)){
                  return next({
                    status: StatusCodes.BAD_REQUEST,
                    message: 'Email not valid.',
                  })
                }
            
                const existingUser = await db.userDataService.findUserByEmail(email);
            
                if (!existingUser) {

                  return next({
                    status: StatusCodes.FORBIDDEN,
                    message: 'Invalid login credentials.',
                  })
                    res.status(403);
                    throw new Error('Invalid login credentials.');
                }
            
                const validPassword = await bcrypt.compare(password, existingUser.password);
                if (!validPassword) {
                    res.status(403);
                    throw new Error('Invalid login credentials.');
                }
            
                const jti = uuidv4();
                const { accessToken, refreshToken } = utils.generateTokens(existingUser, jti);
                await db.authDataService.addRefreshTokenToWhitelist({ jti, refreshToken, user_id: existingUser.id });
            
                res.json({
                    accessToken,
                    refreshToken
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.post('/refreshToken', async (req, res, next) => {
            try {
              const { refreshToken } = req.body;
              if (!refreshToken) {
                res.status(400);
                throw new Error('Missing refresh token.');
              }
              const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
              if (typeof payload == 'string') throw new Error('Some jwt token error');
              if (!payload.jti || !payload.user_id) throw new Error('Some another jwt token error');
              const savedRefreshToken = await db.authDataService.findRefreshTokenById(payload.jti);
          
              if (!savedRefreshToken || savedRefreshToken.revoked === true) {
                res.status(401);
                throw new Error('Unauthorized');
              }
          
              const hashedToken = utils.hashToken(refreshToken);
              if (hashedToken !== savedRefreshToken.hashedToken) {
                res.status(401);
                throw new Error('Unauthorized');
              }
          
              const user = await db.userDataService.findUserById(payload.user_id);
              if (!user) {
                res.status(401);
                throw new Error('Unauthorized');
              }
          
              await db.authDataService.deleteRefreshToken(savedRefreshToken.id);
              const jti = uuidv4();
              const { accessToken, refreshToken: newRefreshToken } = utils.generateTokens(user, jti);
              await db.authDataService.addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, user_id: user.id });
          
              res.json({
                accessToken,
                refreshToken: newRefreshToken
              });
            } catch (err) {
              next(err);
            }
        });

        this.router.post('/revokeRefreshTokens', async (req, res, next) => {
            try {
              const { user_id } = req.body;
              await db.authDataService.revokeTokens(user_id);
              res.json({ message: `Tokens revoked for user with id #${user_id}` });
            } catch (err) {
              next(err);
            }
          });
    }

    public getRoutes(){
        return this.router
    }
}