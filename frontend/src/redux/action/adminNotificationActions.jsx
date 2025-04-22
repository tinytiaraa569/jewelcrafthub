// actions/adminNotificationActions.js
import { backendurl } from "@/server";
import axios from "axios";

export const createAdminNotification = (userId, title, message, icon) => async (dispatch) => {
  try {
    dispatch({ type: "ADMIN_NOTIFICATION_CREATE_REQUEST" });

    const { data: newNotification } = await axios.post(`${backendurl}/adminnotification/admin-notifications`, {
      userId,
      title,
      message,
      icon,
    });

    dispatch({
      type: "ADMIN_NOTIFICATION_CREATE_SUCCESS",
      payload: newNotification,
    });
  } catch (error) {
    dispatch({
      type: "ADMIN_NOTIFICATION_CREATE_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};
