import { Router } from "express";
import userController from "../controllers/user.controller.js";
const router = new Router();
import {body} from 'express-validator';
import divisionController from "../controllers/division.controller.js";
import authMiddleware from '../middlewares/auth-middleware.js';

//#region User
router.get('/instance/init',  userController.init);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.post('/restore-query',
  body('email').isEmail(),
  userController.restoreQuery
  );
router.post('/restore', userController.restore);
router.get('/user', authMiddleware, userController.getUser);
router.post('/users/read',
  (req, res, next)=> authMiddleware(req, res, next, ['admin']), userController.read);
router.post("/user/create", (req, res, next) => authMiddleware(req, res, next, ["admin"]),
  body("first_name").isString(),
  body("last_name").isString(),
  body("patronymic").isString(),
  body("email").isEmail(),
  body("begin_date").isString(),
  body("end_date").isString().optional({ nullable: true }),
  body("division_id").isNumeric(),
  userController.create);

router.post('/user/edit', (req, res, next) => authMiddleware(req, res, next, ['admin']),
  body('id').isNumeric(),
  body('first_name').isString(),
  body('last_name').isString(),
  body('patronymic').isString(),
  body('email').isEmail(),
  body('begin_date').isString(),
  body('end_date').isString().optional({ nullable: true }),
  body('division_id').isNumeric(),
  userController.edit);
router.post('/user/close', (req, res, next) => authMiddleware(req, res, next, ['admin']),
  body('id').isNumeric(),
  userController.close);
//#endregion
//#region Division
router.get('/divisions',
  (req, res, next)=> authMiddleware(req, res, next, ['admin']),
  divisionController.read);
router.get('/divisions/child',
  (req, res, next)=> authMiddleware(req, res, next, ['admin']),
  divisionController.readNode);
router.post('/division/push',
  (req, res, next)=> authMiddleware(req, res, next, ['admin']),
  body('name').isString(),
  body('parent_id').isNumeric(),
  divisionController.divisionPush);
router.get('/division/drop',
  (req, res, next)=> authMiddleware(req, res, next, ['admin']),
  divisionController.divisionDrop);
//#endregion

export default router