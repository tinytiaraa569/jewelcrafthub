import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { checkAdminAuth } from "@/redux/slices/adminAuthSlice";

const AdminProtectedRoutes = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, authChecked } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    dispatch(checkAdminAuth());
  }, [dispatch]);

  if (!authChecked) return <p>Loading...</p>;

  if (!isAuthenticated) return <Navigate to="/admin" replace />;

  return children;
};

export default AdminProtectedRoutes;
