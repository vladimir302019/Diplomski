import {axiosClient} from "./AxiosService";

export const Login = async (requestBody) => {
    return await axiosClient.post(
        `${process.env.REACT_APP_API_ENDPOINT}/user/login`, requestBody
    );
};

export const Register = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/user/register`, requestBody
    );
};

export const GetUserInfoAction = async (requestBody) => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/user/user`
    );
};

export const UpdateUser = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/user/update-profile`, requestBody
    );
};

export const UploadImage = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/user/upload-image`, requestBody
    );
};

export const GetImage = async (requestBody) => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/user/get-image`
    );
};

export const ChangePassword = async (requestBody) => {
    return await axiosClient.post(
        `${process.env.REACT_APP_API_ENDPOINT}/user/change-password`, requestBody
    );
};

export const GoogleLogin = async (requestBody) => {
    return await axiosClient.post(
        `${process.env.REACT_APP_API_ENDPOINT}/user/external-login`, requestBody
    );
};

export const GetInactiveSellers = async () => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/user/unactivated-sellers`
    );
};

export const GetActiveSellers = async () => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/user/activated-sellers`
    );
};

export const ApproveSeller = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/user/activate-user`, requestBody
    );
};