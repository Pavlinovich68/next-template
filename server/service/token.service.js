import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TokenService {
   generateTokens(payload) {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
      return {
         accessToken,
         refreshToken
      }
   }

   validateAccessToken(token) {
      try {
         const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
         return userData;
      } catch (e) {
         return null;
      }
   }

   validateRefreshToken(token) {
      try {
         const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
         return userData;
      } catch (e) {
         return null;
      }
   }

   async saveToken(userId, refreshToken) {
      const tokenData = await prisma.tokens.findFirst({
         where: {user_id: userId},
         select: {
            id: true,
            refresh_token: true
         }
      });
      if (tokenData) {
         const token = await prisma.tokens.update({
            where: {id: tokenData.id},
            data: {refresh_token: refreshToken}
         });
         return token.refresh_token;
      }
      const token = await prisma.tokens.create({
         data: {
            refresh_token: refreshToken,
            user_id: userId
         }
      });

      return token.refresh_token;
   }

   async removeToken(refreshToken) {
      const token = await this.findToken(refreshToken);
      const deletedToken = await prisma.tokens.delete({
         where: {id: token.id}
      });
      return deletedToken;
   }

   async findToken(refreshToken) {
      const token = await prisma.tokens.findFirst({
         where: {refresh_token: refreshToken}
      });
      return token;
   }
}

export default new TokenService();