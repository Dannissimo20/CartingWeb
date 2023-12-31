import axios from 'axios';
import {removeCookie, setCookie} from "typescript-cookie";
import {RegisterFail, LoginFail} from "../redux/actions/authActions"
import {Answer, LoginModel, RegistrationModel, Client} from "../models/Models";
import {clientActions} from '../redux/slices/clientSlice'

const API_URL = "http://localhost:5050/auth/"

class AuthService {
	register(reg: RegistrationModel) {
		return axios.post(API_URL + "signup", reg)
			.then((res) => {
				const data: Answer = res.data;
				if (data.status) {
					setCookie("access_token", data.access_token);//, {expires: 1, path: ''});
					//setCookie("refresh_token", data.answer.refresh_token, {path: ''});
					const client: Client = data.user;
					localStorage.setItem('user', JSON.stringify(client))
					return clientActions.registerSuccess({isAuth: true, client: client});
				}
				return RegisterFail("Нифига не сработало");
			}).catch((err) => {
				return RegisterFail(err);
			})
	}

	login(login: LoginModel) {
		return axios.post(API_URL + "signin", login).then(
			(res) => {
				const data: Answer = res.data;
				if (data.status) {
					setCookie("access_token", data.access_token, {expires: 1, path: ''});
					//setCookie("refresh_token", data.answer.refresh_token, {path: ''});
					const client: Client = data.user;
					localStorage.setItem('user', JSON.stringify(client));
					return clientActions.loginSuccess({isAuth: true, client: client});
				}
				return LoginFail("Нифига не сработало");
			}).catch((err) => {
			return LoginFail(err);
		})
	}

	logout() {
		removeCookie("access_token", {path: ''});
		//removeCookie("refresh_token", {path: ''});
		localStorage.removeItem('user');
		return clientActions.logout();
	}
}

export default new AuthService();