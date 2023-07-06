import axios from "axios";
import { notification } from "antd";

axios.defaults.baseURL = "/proxy";
axios.defaults.timeout = 60000;

// 请求拦截
axios.interceptors.request.use(
	config => {
		// const token = store.state.token;
		// config.headers.Authorization = token
		return config;
	},
	error => {
		return Promise.error(error);
	}
);

// 响应拦截
axios.interceptors.response.use(
	response => {
		if (response.status === 200) {
			return Promise.resolve(response);
		} 
			notification.error({
				description: "出了一点小问题",
				message: "错误"
			});
			return Promise.reject(false);
		
	},
	error => {
		notification.error({
			description: "出了一点问题",
			message: "错误"
		});
		return Promise.reject(error);
	}
);

export default axios;
