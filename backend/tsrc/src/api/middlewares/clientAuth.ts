import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken'

export default function isClientAuthenticated(req, res, next) {
  const { authorization } = req.headers;
  // console.log(req.headers)

  if (!authorization) {
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: '🚫 Un-Authorized 🚫'
    })
  }

  try {
    const token = authorization.split(' ')[1];
    // console.log(process.env.JWT_ACCESS_SECRET)
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!payload["client_id"]){

      return next({
        status: StatusCodes.UNAUTHORIZED,
        message: '🚫 Un-Authorized 🚫. Client err'
      })
    }
    req.payload = payload;
  } catch (err) {
    res.status(401);
    console.log(err)
    if (err.name === 'TokenExpiredError') {
      return next({
        status: StatusCodes.UNAUTHORIZED,
        message: '🚫 Un-Authorized 🚫. TokenExpiredError'
      })
    }
    throw new Error(err.name);
  }
  
  return next();
}