import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errorResponse } from "../helpers/response.js";

dotenv.config();

const publicRoutes = [
  "route POST:/api/v1/auth/login",
  "route POST:/api/v1/auth/register",
  "route Get:/api/v1/categories",
  "route Get:/public/uploads",
];

export const authMiddleware = (req, res, next) => {
  try {
    const method = req.method;
    const path = req.path;
    const route = `${method}:${path}`;
    // console.log("method", method);
    // console.log("path", path);
    // console.log("route", route);
    if (publicRoutes.some((publicRoute) => route.includes(publicRoute))) {
      return next();
    }

    const token = req.headers.authorization?.split(" ")[1];
    console.log("Authorization:", req.headers.authorization);
    console.log(token);

    if (!token) {
      return errorResponse(res, 401, req.t("accessTokenRequired"));
    }

    console.log("the token is here", token);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.auth = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      userName: decoded.userName,
      phoneNumber: decoded.phoneNumber,
    };

    next();
  } catch (error) {
    console.log("error is here", error);
    return errorResponse(res, 401, req.t("invalidOrExpiredToken"));
  }
};
