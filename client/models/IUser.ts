import {IDivision} from "./IDivision";

export interface IUser {
    email: string,
    id: string;
    division: IDivision,
    division_id: number,
    first_name: string,
    last_name: string,
    patronymic: string,
    begin_date: Date,
    end_date: Date
    roles: any[];
}