import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { backendurl } from "@/server"; // Replace this with your actual backend URL

// Admin Login
export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendurl}/admin/admin-login`, adminData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Check Admin Auth
export const checkAdminAuth = createAsyncThunk(
  "adminAuth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendurl}/admin/check-auth`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Not authenticated");
    }
  }
);

// Admin Logout
export const adminLogout = createAsyncThunk(
  "adminAuth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${backendurl}/admin/admin-logout`, {}, { withCredentials: true });
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// ✅ Fetch Admin Profile (Using Cookies for Auth)
export const fetchAdminProfile = createAsyncThunk(
  "adminAuth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendurl}/admin/admin-profile`, {
        withCredentials: true, // ✅ Send cookies for authentication
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch admin profile");
    }
  }
);


// Initial State
const initialState = {
  isAuthenticated: false,
  loading: false,
  adminUser: null,
  error: null,
  authChecked: false, // ✅ Key for controlling logic
};

// Slice
const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.adminUser = action.payload.admin;
        state.authChecked = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.adminUser = null;
        state.error = action.payload;
        state.authChecked = true;
      })

      .addCase(checkAdminAuth.pending, (state) => {
        state.loading = true;
        state.authChecked = false;
      })
      .addCase(checkAdminAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.adminUser = action.payload;
        state.authChecked = true;
      })
      .addCase(checkAdminAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.adminUser = null;
        state.authChecked = true;
      })

      .addCase(adminLogout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.adminUser = null;
        state.authChecked = true;
      })

      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.adminUser = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export default adminAuthSlice.reducer;
