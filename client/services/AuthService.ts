import $api from '../http';
import {AxiosResponse} from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/login', {email, password})
    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration', {email, password})
    }

    static async logout(): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('/logout')
    }

    static async restoreQuery(email: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('/restore-query', {email});
    }
    static async restore(id: number, key: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('/restore', {id, key, password});
    }
}