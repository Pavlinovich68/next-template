import req from "express/lib/request.js";

import ApiError from '../exceptions/api-error.js';
import tokenService from '../service/token.service.js';

export default (req, res, next, roles) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        const userRoles = userData.roles.map(i => i.name);
        const isAccess = userRoles.filter(i => roles.includes(i));
        if (!isAccess || isAccess.length === 0) {
            return next(ApiError.NotEnoughRights());
        }

        req.use = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}