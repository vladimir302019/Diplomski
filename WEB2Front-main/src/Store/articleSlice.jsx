import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {GetAllArticles, NewArticle, UpdateArticle, DeleteArticle, GetSellerArticles, UploadArticleImage, GetArticleImage} from "../Services/ArticleService";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    allArticles: [],
    sellerArticles: [],
    imageUrl: localStorage.getItem("imageUrl") !== null ? JSON.parse( localStorage.getItem("imageUrl")) : null,
};

export const getAllArticlesAction = createAsyncThunk(
    "article/get-all",
    async(data,thunkApi) => {
        try{
            const response = await GetAllArticles();
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const getSellerArticlesAction = createAsyncThunk(
    "article/seller-get",
    async(data,thunkApi) => {
        try{
            const response = await GetSellerArticles();
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const newArticleAction = createAsyncThunk(
    "article/new-article",
    async(data,thunkApi) => {
        try{
            const response = await NewArticle(data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const deleteArticleAction = createAsyncThunk(
    "article/delete",
    async(data,thunkApi) => {
        try{
            const response = await DeleteArticle(data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const updateArticleAction = createAsyncThunk(
    "article/update-article",
    async(data,thunkApi) => {
        try{
            const response = await UpdateArticle(data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const uploadArticleImageAction = createAsyncThunk(
    "article/upload-image",
    async(data,thunkApi) => {
        try{
            const response = await UploadArticleImage(data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

export const getArticleImageAction = createAsyncThunk(
    "article/get-image",
    async(data,thunkApi) => {
        try{
            const response = await GetArticleImage(data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
);

const articleSlice = createSlice({
    name: "article",
    initialState,
    reducers: {
        clearAllArticles(state) {
            state.allArticles = [];
        },
        clearSellersArticles(state){
            state.sellerArticles = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllArticlesAction.fulfilled, (state, action)=> {
            state.allArticles = [...action.payload];
        });
        builder.addCase(getAllArticlesAction.rejected, (state, action)=> {
            let error = "Fetching articles error";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(getSellerArticlesAction.fulfilled, (state, action)=> {
            state.sellerArticles = [...action.payload];
        });
        builder.addCase(getSellerArticlesAction.rejected, (state, action)=> {
            let error = "Fetching seller articles error";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(newArticleAction.fulfilled, (state, action)=> {
            toast.success
            ("New article successfully created!",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(newArticleAction.rejected, (state, action)=> {
            let error = "Creating new article error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(updateArticleAction.fulfilled, (state, action)=> {
            toast.success("Updated article successfully!",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(updateArticleAction.rejected, (state, action)=> {
            let error = "Updating article error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.s(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(deleteArticleAction.fulfilled, (state, action)=> {
            toast.success("Article successfully deleted!",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(deleteArticleAction.rejected, (state, action)=> {
            let error = "Deleting article error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(uploadArticleImageAction.fulfilled, (state, action)=> {
            toast.success("New image for article successfully uploaded!",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(uploadArticleImageAction.rejected, (state, action)=> {
            let error = "Uploading image for article error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });

        builder.addCase(getArticleImageAction.fulfilled, (state, action)=> {
            state.imageUrl = action.payload.imageBytes;
            localStorage.setItem("imageUrl", JSON.stringify(action.payload.imageBytes));
        });
        builder.addCase(getArticleImageAction.rejected, (state, action)=> {
            let error = "Fetching image for article error!";
            if(typeof action.payload === "string")
                error = action.payload;
            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
    },
})

export const {clearAllArticles, clearSellersArticles} = articleSlice.actions;
export default articleSlice.reducer;