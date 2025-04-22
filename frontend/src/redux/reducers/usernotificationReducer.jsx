// const initialState = {
//   notifications: [], // all notifications
//   loading: false,
//   error: null,
// };

// export const usernotificationReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "NOTIFICATION_CREATE_REQUEST":
//     case "ROLE_NOTIFICATION_SEND_REQUEST":
//       return { ...state, loading: true };

//     case "NOTIFICATION_CREATE_SUCCESS":
//       return {
//         ...state,
//         loading: false,
//         notifications: [
//           action.payload.notification,
//           ...state.notifications,
//         ],
//       };

//     case "ROLE_NOTIFICATION_SEND_SUCCESS":
//       return {
//         ...state,
//         loading: false,
//         // Append bulk notifications if returned, otherwise skip
//         notifications: action.payload?.notifications
//           ? [...action.payload.notifications, ...state.notifications]
//           : [...state.notifications],
//       };

//     case "NOTIFICATION_FETCH_SUCCESS":
//       return {
//         ...state,
//         loading: false,
//         notifications: action.payload,
//       };

//     case "NOTIFICATION_CREATE_FAIL":
//     case "ROLE_NOTIFICATION_SEND_FAIL":
//       return { ...state, loading: false, error: action.payload };

//     default:
//       return state;
//   }
// };



const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

export const usernotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "NOTIFICATION_CREATE_REQUEST":
    case "USER_NOTIFICATION_SEND_REQUEST":  // Updated for user notification request
    case "ROLE_NOTIFICATION_SEND_REQUEST":
      return { ...state, loading: true };

    case "NOTIFICATION_CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
        notifications: [action.payload.notification, ...state.notifications],
      };

    case "USER_NOTIFICATION_SEND_SUCCESS":  // Updated for user notification success
    case "ROLE_NOTIFICATION_SEND_SUCCESS":
      return {
        ...state,
        loading: false,
        notifications: action.payload?.notifications
          ? [...action.payload.notifications, ...state.notifications]
          : [...state.notifications],
      };

    case "NOTIFICATION_FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        notifications: action.payload,
      };

    case "NOTIFICATION_CREATE_FAIL":
    case "USER_NOTIFICATION_SEND_FAIL":  // Updated for user notification failure
    case "ROLE_NOTIFICATION_SEND_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
