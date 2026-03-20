import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Import your reducers
import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';
import authReducer from "./slices/auth.slice";
import { baseApi } from './api/baseApi';


// Configuration for which reducers to persist
const persistConfig = {
    key: 'root', // key in localStorage
    storage, // using localStorage
    whitelist: ['user', 'app', 'cart'], // reducers you want to persist
    blacklist: [baseApi.reducerPath] // Don't persist API cache
};

// Combine all reducers
const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    user: userReducer,
    app: appReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions (they're not serializable)
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(baseApi.middleware),
    devTools: import.meta.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;