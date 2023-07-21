import userService from "../service/user.service.js";
import {validationResult} from 'express-validator';
import ApiError from'../exceptions/api-error.js';
import * as uuid from 'uuid';
import mailService from "../service/mail.service.js";

class UserController {
  async init(req, res, next){
    try {
      const userData = await userService.init();
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next){
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }
      const userData = await userService.create(req.body);
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }

  async edit(req, res, next){
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.ValidationError('Ошибка при валидации', errors.array()))
      }
      const userData = await userService.edit(req.body);
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }

  async close(req, res, next){
    try {
      const userData = await userService.close(req.body);
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next){
    try {
      const {email, password} = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next){
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const id = req.query.id;
      const user = await userService.getUser(id);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
  // Запрос на сброс пароля
  async restoreQuery(req, res, next){
    try {
      const {email} = req.body;
      console.log(`Restore params: ${email}`);
      const user = await userService.checkEmail(email);
      if (!user){
        return next(ApiError.UserNotExists(email));
      }
      const key = uuid.v4();
      let date = new Date();
      date.setTime(date.getTime() + (10 * 60 * 1000));
      const link = await userService.setRestore(user.id, key, date);
      await mailService.restoreLink(email, link, date);
      return res.json(link);
    } catch (e) {
      next(e);
    }
  }
  async restore(req, res, next){
    try {
      const {id, key, password} = req.body;
      const user = await userService.getUser(id);
      const date = new Date();
      if (user.restore_time < date){
        throw ApiError.RestoreLinkExpired();
      }
      if (user.restore_link != key){
        throw ApiError.BadRestoreKey();
      }
      const result = await userService.restore(id, password);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async read(req, res, next){
    try {
      const users = await userService.read(req.body);
      return res.json(users);
    } catch (e) {
      next(e)
    }
  }
}

export default new UserController();