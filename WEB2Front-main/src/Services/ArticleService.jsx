import {axiosClient} from "./AxiosService";

export const GetAllArticles = async () => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/article/get-all`
    );
};

export const NewArticle = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/article/new-article`, requestBody
    );
};

export const UpdateArticle = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/article/update-article`, requestBody
    );
};

export const DeleteArticle = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/article/delete`, requestBody
    );
};

export const GetSellerArticles = async () => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/article/seller-get`
    );
};

export const UploadArticleImage = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/article/upload-image`, requestBody
    );
};

export const GetArticleImage = async (requestBody) => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/article/get-image`, requestBody
    );
};