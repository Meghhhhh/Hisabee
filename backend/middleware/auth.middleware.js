import handleResponse from '../utils/responsehandler.js';
import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return handleResponse(res, 401, 'Token not found');
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return handleResponse(res, 401, 'TOKEN INVALID');
  }
};

export default auth;
