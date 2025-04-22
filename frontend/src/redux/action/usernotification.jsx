import { backendurl } from "@/server";
import axios from "axios";

// Action to create a notification and store it in Redux
export const createNotification = (userId, title, message, icon) => async (dispatch) => {
  try {
    dispatch({ type: "NOTIFICATION_CREATE_REQUEST" });

    // Create a new notification
    const { data: newNotification } = await axios.post(`${backendurl}/notification/notifications`, {
      userId,
      title,
      message,
      icon,
    });

    // Add the new notification to Redux
    dispatch({
      type: "NOTIFICATION_CREATE_SUCCESS",
      payload: newNotification,
    });
  } catch (error) {
    dispatch({
      type: "NOTIFICATION_CREATE_FAIL",
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};



// Send a notification to all users with a specific role (e.g. "Approved")
export const sendNotificationToRole = (role, title, message, icon) => async (dispatch) => {
  try {
    dispatch({ type: "ROLE_NOTIFICATION_SEND_REQUEST" });

    const { data } = await axios.post(`${backendurl}/notification/role-notifications`, {
      role,
      title,
      message,
      icon,
    });

    dispatch({
      type: "ROLE_NOTIFICATION_SEND_SUCCESS",
      payload: data, // optionally contains notifications
    });
  } catch (error) {
    dispatch({
      type: "ROLE_NOTIFICATION_SEND_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};


// Send notification to a specific set of users
export const sendNotificationToUsers = (userIds, title, message, icon) => async (dispatch) => {
  try {
    dispatch({ type: "USER_NOTIFICATION_SEND_REQUEST" });  // Use the new action type for user notifications

    const { data } = await axios.post(`${backendurl}/notification/user-notifications`, {
      userIds,
      title,
      message,
      icon,
    });

    dispatch({
      type: "USER_NOTIFICATION_SEND_SUCCESS",  // New action type for user notifications
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "USER_NOTIFICATION_SEND_FAIL",  // New action type for user notification failure
      payload: error.response?.data?.message || error.message,
    });
  }
};
