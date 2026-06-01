import jwt from "jsonwebtoken";
import { serverResponse } from "../services/serverresponse.js";

export const verifyToken = (req, res, next) => {
  try {
    const authheader = req.headers.authorization;
    if (!authheader) return serverResponse(res, 401, "token not found");
    const token = authheader.split(' ')[1]
    if (!token) return serverResponse(res, 401, "token invalid format");
    const decoded = jwt.verify(token,process.env.JWT_KEY);
    if (!decoded) return serverResponse(res, 409, "Token invalid");
    req.user = decoded.user.id;
    next();
  } catch (err) {
    return serverResponse(res, 500, err.message);
  }
};
