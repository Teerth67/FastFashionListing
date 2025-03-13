import { createSlice,createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"
import { toast } from "react-toastify"
import axiosInstance from "../../../axiosinterceptor/axiosInstance";
import { clearWishlist } from "../wishlist/wishlistSlice";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const initialState = {
    isLoggedIn: !!localStorage.getItem("token"),
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    // You should add token here
    token: localStorage.getItem("token") || null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};
//REGISTER_USER
export const register = createAsyncThunk(
    "auth/register",
    async(userData, thunkAPI) => {
        try {
            const response = await authService.register(userData);
            // You could also set the token here if not done in the service
            return response;
        } catch (error) {
            const message = (error.response && 
                error.response.data &&
                error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
)

//LOGIN_USER
export const login = createAsyncThunk(
    "auth/login",
    async(userData,thunkAPI)=>{
        try{
            return await authService.login(userData)

        } catch (error){
            const message=(error.response && 
                error.response.data &&
                error.response.data.message) || error.message || error.toString()

                return thunkAPI.rejectWithValue(message)

        }
    }
)

//LOGOUT_USER
// In authSlice.js
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
      try {
        const response = await axiosInstance.get("/users/logout");
        
        if (response.status === 200) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          
          // Clear wishlist state using thunkAPI.dispatch
          thunkAPI.dispatch(clearWishlist());
          
          // Optional but recommended: clear persist storage
          localStorage.removeItem('persist:wishlist');
          localStorage.removeItem("persist:auth");
        }
        
        return response.data.message;
      } catch (error) {
        // console.error("Logout failed:", error);
        return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
      }
    }
  );

//getLoginStatus
export const getLoginStatus = createAsyncThunk(
    "auth/getLoginStatus",
    async(_,thunkAPI)=>{
        try{
            return await authService.getLoginStatus()

        } catch (error){
            const message=(error.response && 
                error.response.data &&
                error.response.data.message) || error.message || error.toString()

                return thunkAPI.rejectWithValue(message)

        }
    }
)

//getUser
export const getUser = createAsyncThunk(
    "auth/getUser",
    async(_,thunkAPI)=>{
        try{
            return await authService.getUser()

        } catch (error){
            const message=(error.response && 
                error.response.data &&
                error.response.data.message) || error.message || error.toString()

                return thunkAPI.rejectWithValue(message)

        }
    }
)

//updateUser
export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async(userData,thunkAPI)=>{
        try{
            return await authService.updateUser(userData)

        } catch (error){
            const message=(error.response && 
                error.response.data &&
                error.response.data.message) || error.message || error.toString()

                return thunkAPI.rejectWithValue(message)

        }
    }
)


//updatePhoto
export const updatePhoto = createAsyncThunk(
    "auth/updatePhoto",
    async(userData,thunkAPI)=>{
        try{
            return await authService.updatePhoto(userData)

        } catch (error){
            const message=(error.response && 
                error.response.data &&
                error.response.data.message) || error.message || error.toString()

                return thunkAPI.rejectWithValue(message)

        }
    }
)

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        RESET_AUTH(state){
            state.isError=false
            state.isSuccess=false
            state.isLoading=false
            state.message=""
        },
    },
    extraReducers:(builder)=>{
        builder
        //REGISTER_USER
        .addCase(register.pending,(state)=>{
            state.isLoading=true
        })

        .addCase(register.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.isLoggedIn= true
            state.user = action.payload
            toast.success("Registered Successfully")
        })
        .addCase(register.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message= action.payload
            state.user = null
            toast.success(action.payload)
        })

        //LOGIN_USER
        .addCase(login.pending,(state)=>{
            state.isLoading=true
        })

        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isLoggedIn = true;
            state.user = action.payload.user;  // ✅ Ensure correct user data is stored
        
            localStorage.setItem("token", action.payload.token); 
            localStorage.setItem("user", JSON.stringify(action.payload.user)); // ✅ Save full user data
            
            // console.log("User after login:", action.payload.user); // ✅ Check if photo is included
            
            toast.success("Login Successful");
        })
        
        .addCase(login.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message= action.payload
            state.user = null
            toast.success(action.payload)
        })

        //LOGOUT_USER
        .addCase(logout.pending,(state)=>{
            state.isLoading=true
        })

        .addCase(logout.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.isLoggedIn= false
            state.user = null
            toast.success(action.payload)
            // console.log( action.payload)
        })
        .addCase(logout.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message= action.payload
            toast.success(action.payload)
        })

        //getLoginStatus
        .addCase(getLoginStatus.pending,(state)=>{
            state.isLoading=true
        })

        .addCase(getLoginStatus.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.isLoggedIn= action.payload
            // console.log( action.payload)
            if(action.payload.message === "invalid signature"){
                state.isLoggedIn= false
            }
        })
        .addCase(getLoginStatus.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message= action.payload
           
        })

        //getuser
        .addCase(getUser.pending,(state)=>{
            state.isLoading=true
        })

        .addCase(getUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.isLoggedIn= true
            state.user=action.payload

            // console.log( action.payload)
            
        })
        .addCase(getUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message= action.payload
            toast.error(action.payload)
        })

        //updateuser
        .addCase(updateUser.pending,(state)=>{
            state.isLoading=true
        })

        .addCase(updateUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.isLoggedIn= true
            state.user=action.payload
            toast.success("User Updated!")
            // console.log( action.payload)
            
        })
        .addCase(updateUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message= action.payload
            toast.error(action.payload)
        })

        //updatePhoto
        .addCase(updatePhoto.pending,(state)=>{
            state.isLoading=true
        })

        .addCase(updatePhoto.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.isLoggedIn= true
            state.user=action.payload
            toast.success("User Photo Updated!")
            // console.log( action.payload)
            
        })
        .addCase(updatePhoto.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message= action.payload
            toast.error(action.payload)
        })

        
    }
})

export const {RESET_AUTH} = authSlice.actions

export default authSlice.reducer