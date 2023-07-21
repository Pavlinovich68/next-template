import nodeMailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
class MailService {
   constructor() {
      this.transporter = nodeMailer.createTransport({
         host: 'mail2.gov74.ru',
         port: 25,
         secure: false,
         auth: {
            user: 'dev-public@gov74.ru',
            pass: '7qlu7T8V'
         },
         ignoreTLS:true,
         requireTLS:false,
         debug: true
      });
   }
   async newUser(to, password) {
      await this.transporter.sendMail({
         from: process.env.SMTP_USER,
         to: to,
         text: '',
         subject: `${process.env.APP_NAME}: Новый пользователь`,
         html:
             `<div>
                <h3>Для Вас создана учетная запись</h3>
                <p>Логин: ${to}</p>
                <p>Пароль: ${password}</p>
                <p>Ссылка для входа в систему: <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a></p>
               </div>
             `
      });
   }

   async restoreLink(to, link, date){
      console.log(link);
      await this.transporter.sendMail({
         from: process.env.SMTP_USER,
         to: to,
         text: '',
         subject: `${process.env.APP_NAME}: Запрос на восстановление пароля`,
         html:
           `<div>
                <h3>Запрос действителен до ${date.toLocaleString("ru-RU")}</h3>
                <p>Для восстановления пароля пройдите по ссылке: <a href="${link}">${process.env.APP_NAME}</a></p>
               </div>
             `
      });
   }

   async sendRequest(senderInfo, subj, body, date, id){
      const user = await prisma.users.findFirstOrThrow({
         where: {id: senderInfo.id},
         include: { division: true}
      });
      let html = `<h2 style="margin-bottom: 1em">Заявка в службу технической поддержки</h2>
                  <table>
                    <tr>
                      <td><b>Фамилия Имя Отчество</b></td>
                      <td>${user.last_name} ${user.first_name} ${user.patronymic}</td>
                    </tr>
                    <tr>
                      <td><b>Подразделение</b></td>
                      <td>${user.division.name}</td>
                    </tr>
                    <tr>
                      <td><b>EMail</b></td>
                      <td><a href="mailto:${user.email}">${user.email}</a></td>
                    </tr>
                    <tr>
                      <td><b>Дата и время отправления</b></td>
                      <td>${date}</td>
                    </tr>
                    <tr>
                      <td><b>Внутренний идентификатор</b></td>
                      <td>#${id}</td>
                    </tr>
                  </table>
                  <h3>Содержание заявки:</h3>
                  <p>${body}</p>`;
      await this.transporter.sendMail({
         from: process.env.SMTP_USER,
         //to: 'pavlinovich@list.ru',
         to: 'sd@mininform74.ru',
         text: '',
         subject: `ServiceDesk: ${subj}`,
         html: html
      });
   }
}

export default new MailService();