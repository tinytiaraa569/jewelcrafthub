const initialState = {
    adminNotifications: [], // Renamed for clarity
    loading: false,
    error: null,
  };
  
  export const adminNotificationReducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADMIN_NOTIFICATION_CREATE_REQUEST":
        return { ...state, loading: true };
  
      case "ADMIN_NOTIFICATION_CREATE_SUCCESS":
        return {
          ...state,
          loading: false,
          adminNotifications: [
            action.payload.notification,
            ...state.adminNotifications,
          ],
        };
  
      case "ADMIN_NOTIFICATION_FETCH_SUCCESS":
        return {
          ...state,
          loading: false,
          adminNotifications: action.payload, // Full replace on fetch
        };
  
      case "ADMIN_NOTIFICATION_CREATE_FAIL":
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  