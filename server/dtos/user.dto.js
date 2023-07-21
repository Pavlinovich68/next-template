export default class UserDto {
   email;
   id;
   beginDate;
   endDate;
   roles;

   constructor(model) {
      this.email = model.email;
      this.id = model.id;
      this.beginDate = model.begin_date;
      this.endDate = model.end_date;
      this.roles = model.roles;
   }
}