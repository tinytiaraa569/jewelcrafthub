// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.jsx";
import { usernotificationReducer } from "./reducers/usernotificationReducer.jsx";
import adminAuthReducer from "./slices/adminAuthSlice.jsx";
import { adminNotificationReducer } from "./reducers/adminNotificationReducer.jsx";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    userNotification:usernotificationReducer,
    adminNotifications: adminNotificationReducer,
    adminAuth: adminAuthReducer,
  },
});
