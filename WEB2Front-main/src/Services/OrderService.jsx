import {axiosClient} from "./AxiosService";

export const NewOrder = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/order/new-order`, requestBody
    );
};

export const GetOrder = async (requestBody) => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/order/get-order`, requestBody
    );
};

export const GetOrders = async () => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/order/get-orders`
    );
};

export const GetUndeliveredOrders = async () => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/order/get-undelivered-orders`
    );
};

export const GetSellerNewOrders = async () => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/order/get-seller-new-orders`
    );
};

export const GetSellerOldOrders = async () => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/order/get-seller-old-orders`
    );
};

export const GetUserOrders = async () => {
    return await axiosClient.get(
        `${process.env.REACT_APP_API_ENDPOINT}/order/get-user-orders`
    );
};

export const CancelOrder = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/order/cancel-order`, requestBody
    );
};

export const AddOrderItems = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/order/add-order-items`, requestBody
    );
};

export const ApproveOrder = async (requestBody) => {
    return await axiosClient.put(
        `${process.env.REACT_APP_API_ENDPOINT}/order/approve-order`, requestBody
    );
};



