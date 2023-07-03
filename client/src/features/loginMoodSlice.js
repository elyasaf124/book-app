import { createSlice, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        loginModel: false,
        registerModel: false,
        cartQuantity: 0,
        user: {

        }
    },
    reducers: {
        setLogin: state => {
            state.isLoggedIn = true;
        },
        setLogout: state => {
            state.isLoggedIn = false;
        },
        setLoginModel: state => {
            state.loginModel = !state.loginModel;
        },
        setRegisterModel: state => {
            state.registerModel = !state.registerModel;
        },
        setUserDetails: (state, action) => {
            state.user = action.payload
        },
    },
});

const persistConfig = {
    key: 'auth',
    storage,
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

export const {
    setLogin,
    setLogout,
    setLoginModel,
    setRegisterModel,
    setUserDetails,
}
    = authSlice.actions

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);