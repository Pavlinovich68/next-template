import { makeAutoObservable } from "mobx";
import axios from "axios";
import {IUser} from "../models/IUser";
import AuthService from "../services/AuthService";
import {AuthResponse} from "../models/response/AuthResponse";
import {$app_variables} from "../app.variables";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;
    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setUser(response.data.user);
            this.setAuth(true);
        } catch (e) {
            console.log(e);
        }
    }
    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
            return response;
        } catch (e) {
            console.log(e);
        }
    }

    async  checkAuth(){
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${$app_variables.API_URL}/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            console.log(`User: ${response.data.user.email}: ${this.isAuth}`)
            return response;
        } catch (e) {
            console.log(e);
        } finally {
            this.setLoading(false);
        }
    }

    async restoreQuery(email: string){
        try {
            console.log(email);
            const response = await AuthService.restoreQuery(email);
            console.log("На почтовый ящик Вам выслвны инструкции для восстановления пароля");
            return response;
        } catch (e) {
            console.log(e);
        }
    }
    async restore(elem: any, password: string){
        try {
            const form = elem.target.closest('.itr-body');
            const id = form.getAttribute('data-restore-id');
            const key = form.getAttribute('data-restore-key');
            const response = await AuthService.restore(id, key, password);
            const result = JSON.parse(JSON.stringify(response));
            this.setAuth(false);
            this.setUser({} as IUser);
            if (result.status === 200){
                window.location.assign('http://localhost:3000');
            }
        } catch (e) {
            console.log(e);
        }
    }
}