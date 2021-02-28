import axios from "axios";
import { config } from "../config.js"

export function isLoggedIn() {
    const isLogged = localStorage.getItem('authenticated');
    if (isLogged == "true") {
        return true;
    } else {
        return false;
    }
}

export function getAccessToken() {
    const userData = localStorage.getItem('user');
    if (userData) {
        var userObj = JSON.parse(userData);
        if (userObj && userObj.access_token !== "") {
            return userObj.access_token;
        }
    }

    return false;
}

export async function login(user) {

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    var formData = new URLSearchParams();
    formData.append('userName', user.userName);
    formData.append('password', user.password);
    formData.append('countryCode', user.countryCode);
    formData.append('bizType', user.bizType);
    formData.append('from', user.from);

    const data = await axios({ url: config.CORS_PROXY_URL+config.SMARTLIFE_API_URL+'auth.do', data: formData, method: 'POST', headers: headers })
    
        .then(resp => {

            if (resp.data.access_token) {
                console.log(resp.data.access_token);
                const userData = {
                    'access_token': resp.data.access_token,
                    'refresh_token': resp.data.refresh_token,
                    'expires_in': Date.now() + resp.data.expires_in * 1000,
                }

                localStorage.setItem("authenticated", true);
                localStorage.setItem("user", JSON.stringify(userData));
                return true;
            } else {
                console.error(resp.data.errorMsg);
                localStorage.removeItem("authenticated")
                localStorage.removeItem("user")
                return false;
            }
        })
        .catch(err => {
            console.error(err);
            localStorage.removeItem("authenticated")
            localStorage.removeItem("user")
            return false;
        })

        return data;
}


export function logout() {
    localStorage.removeItem("authenticated")
    localStorage.removeItem("user")
}

/*
export async function refreshToken() {
    const data = await $axios({url: config.API_BASE_URL + 'refresh', method: 'POST' })
    .then(resp => {
      const access_token = resp.data.access_token
      set("access_token", access_token)

      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    })

    return data;
}
*/