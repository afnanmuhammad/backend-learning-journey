import { successResponse, errorResponse } from "../helpers/response.js";

const rolesAuth = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.auth) {
        return errorResponse(res, 401, req.t("authenticationRequired"));
      }

      if (!allowedRoles.includes(req.auth.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient Permissions",
        });
      }

      next();
    } catch (error) {
      console.error("Role Authorization Error:", error);
      return errorResponse(res, 500, req.t("internalServerError"));
    }
  };
};

const adminOnly = rolesAuth(["admin"]);
const userOnly = rolesAuth(["user"]);
const userAndAdmin = rolesAuth(["admin", "user"]);

export { adminOnly, userOnly, userAndAdmin };
