import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {Login, Register, GetUserInfoAction, UpdateUser, UploadImage, GetImage, ChangePassword, GoogleLogin } from "../Services/UserService";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    token: localStorage.getItem("token") !== null ? localStorage.getItem("token") : null,
    isLoggedIn: localStorage.getItem("token") != null,
    user:  localStorage.getItem("user") !== null ? JSON.parse( localStorage.getItem("user")) : null,
    imageUrl: localStorage.getItem("imageUrl") !== null ? JSON.parse( localStorage.getItem("imageUrl")) : null,
};

export const loginAction = createAsyncThunk(
    "user/login",
    async (data, thunkApi) =>{
        try{
            const response = await Login(data);
            return thunkApi.fulfillWithValue(response.data);
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

export const registerAction = createAsyncThunk(
    "user/register",
    async(data, thunkApi) => {
        try{
            const response = await Register(data);
            return thunkApi.fulfillWithValue(response.data);
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

export const getUserInfoAction = createAsyncThunk(
    "user/user",
    async(data,thunkApi) => {
        try {
            const response = await GetUserInfoAction(data);
            return thunkApi.fulfillWithValue(response.data);
        }catch (error) {
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

export const updateUserAction = createAsyncThunk(
    "user/update-profile",
    async(data,thunkApi) => {
        try{
            const response = await UpdateUser(data);
            return thunkApi.fulfillWithValue(response.data);
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

export const uploadImageAction = createAsyncThunk(
    "user/upload-image",
    async(data,thunkApi) => {
        try{
            const response = await UploadImage(data);
            return thunkApi.fulfillWithValue(response.data);
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

export const getImageAction = createAsyncThunk(
    "user/get-image",
    async(data, thunkApi) => {
        try{
            const response = await GetImage(data);
            return thunkApi.fulfillWithValue(response.data);
        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

export const changePasswordAction = createAsyncThunk(
    "user/change-password",
    async(data, thunkApi) => {
        try{
            const response = await ChangePassword(data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
            return thunkApi.rejectWithValue(error.response.data.error);
        }
    }
)

export const googleLoginAction = createAsyncThunk(
    "user/external-login",
    async (data, thunkApi) => {
      try {
        const response = await GoogleLogin(data);
        return thunkApi.fulfillWithValue(response.data);
      } catch (error) {
        return thunkApi.rejectWithValue(error.response.data.error);
      }
    }
)

// USER SLICE 
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        logout(state) {
            state.token = null;
            state.user = null;
            state.isLoggedIn = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("imageUrl");
            localStorage.clear();
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginAction.fulfilled, (state, action) => {
            const token = action.payload.token;
            state.token = token;
            state.isLoggedIn = true;
            localStorage.setItem("token", token);
        });
        builder.addCase(loginAction.rejected, (state,action) =>{
            let error = "Login error!";
            if(typeof action.payload === "string"){
                error = action.payload;
            }

            toast.error(error, {
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
            });
        });
        builder.addCase(registerAction.fulfilled, (state, action) =>{
            toast.success("You have registered successfully!",{
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: true,
            });
        });
        builder.addCase(registerAction.rejected, (state, action) => {
            let error = "Registration error!";
            if(typeof action.payload === "string"){
                error = action.payload;
            }

            toast.error(error, {
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: true,
            });
        });
        builder.addCase(getUserInfoAction.fulfilled, (state, action) => {
            state.user = {...action.payload};
            localStorage.setItem("user", JSON.stringify(action.payload));
        });
        builder.addCase(getUserInfoAction.rejected, (state, action) => {
            let error = "User information error!";
            if (typeof action.payload === "string") {
                error = action.payload;
            }

            toast.error(error,{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
              });
        });
        builder.addCase(updateUserAction.fulfilled, (state, action) => {
            state.user.name = action.payload.name;
            state.user.address = action.payload.address;
            state.user.birthDate = action.payload.birthDate;
            state.user.email = action.payload.email;
            state.user.username = action.payload.username;
            localStorage.setItem("user", JSON.stringify(state.user));
            toast.success("Updated successfully!",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
            });
        });
        builder.addCase(updateUserAction.rejected, (state, action) => {
            let error = "User update error";
            if (typeof action.payload === "string") {
              error = action.payload;
            }
      
            toast.error(error, {
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(uploadImageAction.fulfilled, (state, action) => {
            toast.success("Uploaded image successfully!",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
            });
        });
        builder.addCase(uploadImageAction.rejected, (state, action) => {
            let error = "User profile image update error";
            if (typeof action.payload === "string") {
              error = action.payload;
            }
      
            toast.error(error, {
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(getImageAction.fulfilled, (state, action) => {
            state.imageUrl = action.payload.imageBytes;
            localStorage.setItem("imageUrl", JSON.stringify(action.payload.imageBytes));
        });
        builder.addCase(getImageAction.rejected, (state, action) => {
            let error = "User profile image get error";
            if (typeof action.payload === "string") {
              error = action.payload;
            }
      
            toast.error(error, {
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(changePasswordAction.fulfilled, (state, action) => {
            toast.success("Changed password successfully!",{
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
            });
        });
        builder.addCase(changePasswordAction.rejected, (state, action) => {
            let error = "Change password error";
            if (typeof action.payload === "string") {
              error = action.payload;
            }
      
            toast.error(error, {
                position: "top-center",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
            });
        });
        builder.addCase(googleLoginAction.fulfilled, (state, action) => {
            const token = action.payload.token;
            state.token = token;
            state.isLoggedIn = true;
            localStorage.setItem("token", token);
        });

        builder.addCase(googleLoginAction.rejected, (state, action) => {
            let error = "Google login error"; 
            if (typeof action.payload === "string") {
              error = action.payload;
            }

            toast.error(error, {
              position: "top-center",
              autoClose: 2500,
              closeOnClick: true,
              pauseOnHover: false,
            });
          });
    }
});

export const {logout} = userSlice.actions;

export default userSlice.reducer;