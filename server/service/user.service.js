import ApiError from "../exceptions/api-error.js";
import bcrypt from "bcryptjs";
import mailService from "./mail.service.js";
import UserDto from "../dtos/user.dto.js";
import tokenService from "./token.service.js";
import { PrismaClient } from "@prisma/client";
import divisionService from "./division.service.js";

const prisma = new PrismaClient();
class UserService {

  generatePassword() {
    let length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
      retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
  async init() {
    const users = await prisma.users.findMany({});
    if (users.length > 0){
      throw ApiError.InitFailed(`DB instance already initialized!`);
    }
    const email = 'administrator@localhost';
    const password = 'Administrator1!';
    let division = null;
    try {
      division = await divisionService.divisionPush({name: 'Служба администрирования', parent_id: null})
    } catch (e) {
      throw ApiError.InitFailed('Administration department not created!');
    }

    const hashPassword = await bcrypt.hashSync(password, 8);
    try {
      const user = await prisma.users.create({
        data: {
          email: email,
          begin_date: new Date(),
          password: hashPassword,
          division_id: division.id,
          roles: {
            create: [{name: 'admin'}]
          }
        },
        include: {
          roles: true
        }
      });
      const userDto = new UserDto(user);

      return userDto;
    } catch (e) {
      throw ApiError.InitFailed(e.message);
    }
  }
  async create(user) {
    const __user = await this.checkEmail(user.email);
    if (__user){
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${user.email} уже существует!`);
    }

    const password = this.generatePassword();
    const hashPassword = await bcrypt.hashSync(password, 8);
    const _user = await prisma.users.create({
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        patronymic: user.patronymic,
        email: user.email,
        begin_date: new Date(user.begin_date),
        end_date: user.end_date ? new Date(user.begin_date) : null,
        division_id: user.division_id,
        password: hashPassword
      }
    });
    await mailService.newUser(user.email, password);
    return _user;
  }
  async edit(user) {
    const _user = await prisma.users.update({
      where: {
        id: user.id
      },
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        patronymic: user.patronymic,
        email: user.email,
        begin_date: new Date(user.begin_date),
        end_date: user.end_date ? new Date(user.begin_date) : null,
        division_id: user.division_id,
      }
    });
    return _user;
  }

  async close(model) {
    const _user = await prisma.users.update({
      where: {
        id: model.id
      },
      data: {
        end_date: new Date()
      }
    });
    return _user;
  }

  async login(email, password){
    const user = await this.checkEmail(email);
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден')
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль')
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto }
  }

  async logout(refreshToken){
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await prisma.users.findFirst({
      where: { id: userData.id },
      include: { roles: true }
    }) ;

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto}
  }

  async getUser(id) {
    const user = await prisma.users.findFirst({
      where: { id: id }
    });
    return user;
  }

  async checkEmail(email) {
    const user = await prisma.users.findFirst({
      where: { email: email },
      include: { roles: true }
    });
    return user;
  }

  async setRestore(id, key, dt){
    const restoreLink = `${process.env.CLIENT_URL}?route=restore&id=${id}&key=${key}`;
    await prisma.users.update({
      where: { id: id },
      data: {
        restore_link: key,
        restore_time: dt
      }
    });
    return restoreLink;
  }

  async restore(id, password){
    const hashPassword = await bcrypt.hashSync(password, 8);
    const result = await prisma.users.update({
      where: { id: id },
      data: {
        password: hashPassword,
        restore_link: null,
        restore_time: null
      }
    });
    return result;
  }

  //***********************************************************************
  // {
  //     "pageNo": 1,
  //     "pageSize": 10,
  //     "filter": {"division": {"id": {"equals": 6}}},
  //     "orderBy": {"division": {"id": "asc"}}
  // }
  //***********************************************************************
  async read(request){
    let filter = {};
    if (request.filter) {
      if (request.all){
        filter = {
          OR: [
            {
              first_name: {
                contains: request.filter,
                mode: 'insensitive',
              },
            },
            {
              last_name: {
                contains: request.filter,
                mode: 'insensitive',
              },
            },
            {
              patronymic: {
                contains: request.filter,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: request.filter,
                mode: 'insensitive',
              },
            },
            {
              division: {
                name: {
                  contains: request.filter,
                  mode: 'insensitive',
                }
              },
            },
          ]
        }
      } else {
        filter = {
          OR: [
            {
              first_name: {
                contains: request.filter,
                mode: 'insensitive',
              },
            },
            {
              last_name: {
                contains: request.filter,
                mode: 'insensitive',
              },
            },
            {
              patronymic: {
                contains: request.filter,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: request.filter,
                mode: 'insensitive',
              },
            },
            {
              division: {
                name: {
                  contains: request.filter,
                  mode: 'insensitive',
                }
              },
            },
          ],
          AND: [{ OR: [{end_date: null}, {end_date: { gt: new Date() }}]}]
        }
      }
    } else {
      if (!request.all) {
        filter = {
          OR: [{end_date: null}, {end_date: { gt: new Date() }}]
        }
      }
    }

    const totalCount = await prisma.users.count({ where: filter });
    const result = await prisma.users.findMany({
      skip: request.pageSize * (request.pageNo -1),
      take: request.pageSize,
      where: filter,
      orderBy: request.orderBy,
      include: { division: true}
    });
    return {
      recordCount: totalCount,
      pageCount: Math.ceil(totalCount / request.pageSize),
      pageNo: request.pageNo,
      pageSize: request.pageSize,
      result: result
    };
  }
}

export default new UserService();