import axios from "axios";
import { baseUrl } from "../util";

const LoginByStaff = (data) => {

    let url = `${baseUrl}/staff/login/`;
    console.log(`url:${url}`)
    return axios({
        method: 'post',
        url: url,
        headers: {},
        data: data,
    });
}

export default LoginByStaff(data);