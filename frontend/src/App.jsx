import { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import Navbar from './Navbar/Navbar'
import AuthForm from './Navbar/AuthForm'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Home/Home'
import About from './About/About'
import { Toaster } from 'sonner'
import UserDashboard from './UserDashboard/UserDashboard'
import ProtectedRoute from './config/ProtectedRoute'
import { useDispatch } from 'react-redux'
import { verifyAuth } from './redux/slices/authSlice.jsx'
import PublicRoute from './config/PublicRoute'
import ResetPassword from './Navbar/ResetPassword'
import UserDesignUpload from './UserUploadDesign/UserDesignUpload'
import UserDashProfile from './UserProfile/UserDashProfile'
import UserDashPortfolio from './UserPortfolio/UserDashPortfolio'
import UserDashPayout from './UserPayouts/UserDashPayout'
import DesignDashRequirement from './DesignRequirement/DesignDashRequirement'
import Adminlogin from './Admin/AdminAuth/Adminlogin'
import AdminSignup from './Admin/AdminAuth/Adminsignup'
import AdminLogin from './Admin/AdminAuth/Adminlogin'
import AdminDashboard from './Admin/AdminDashboard/AdminDashboard'
import AdminProtectedRoutes from './config/AdminProtectedRoute'
import { checkAdminAuth } from './redux/slices/adminAuthSlice'
import SuperAdminProtectedRoute from './config/SuperAdminProtectedRoute'
import AdminProfileMain from './Admin/AdminProfile/AdminProileMain'
import AdminAllUsersMain from './Admin/Adminallusers/AdminAllUsersMain'
import AdminBreifsMain from './Admin/AdminBriefs/AdminBreifsMain'
import Admincategorymain from './Admin/Admincategory/Admincatgeorymain'
import AdminTeamMain from './Admin/AdminTeam/AdminTeamMain'
import AllDesignsAdmin from './Admin/AllAdminDesigns/AllDesignsAdmin'
import AdminWithdrawalMain from './Admin/AdminWithdrawal/AdminWithdrawalMain'
import UserSupportMain from './UserSupport/UserSupportMain'
import AdminSupportMain from './Admin/AdminSupport/AdminSupportMain'
import Footer from './Footer/Footer'
import Contact from './contact/Contact'
import Designs from './Designs/Designs'
import PrivacyPolicy from './Policy/PrivacyPolicy'
import Termsandcondition from './Policy/Termsandcondition'
import NotFound from './NotFound/NotFound'
import ScrollToTopButton from './ScrollToTopBottom/ScrollToTopButton'
// import HeroSection from './Navbar/HeroSection'
// import './App.css'

function App() {
  const dispatch = useDispatch();
  const location = useLocation(); // Access the current route

  useEffect(() => {
    dispatch(verifyAuth());
    dispatch(checkAdminAuth())
  }, [dispatch]);

  const hideNavbarPaths = ['/user-dashboard','/user-designupload' , '/user-support' , '/user-profile' ,"/user-portfolio" ,'/user-payouts' ,'/design-brief' ,'/admin-dashboard' ,'/admin-profile' , '/admin-allusers' ,'/admin-briefs' ,'/admin-category','/admin-team' ,'/admin-signup','/admin-all-designs','/admin-withdrawals' ,'/admin-support'];

  return (
    <>
    {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

    <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/about' element={<About />} />
    <Route path='/contact' element={<Contact />} />
    <Route path='/designs' element={<Designs />} />

    <Route path='/privacy-policy' element={<PrivacyPolicy />} />
    <Route path='/terms-condition' element={<Termsandcondition />} />





      {/* <Route path='/auth' element={<AuthForm />} /> */}


      <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
             </ProtectedRoute>
          }
        />

        <Route
          path="/user-designupload"
          element={
            <ProtectedRoute>
              <UserDesignUpload />
             </ProtectedRoute>
          }
        />

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UserDashProfile />
             </ProtectedRoute>
          }
        />
         <Route
          path="/user-support"
          element={
            <ProtectedRoute>
              <UserSupportMain />
             </ProtectedRoute>
          }
        />
        <Route
          path="/user-portfolio"
          element={
            <ProtectedRoute>
              <UserDashPortfolio />
             </ProtectedRoute>
          }
        />

        <Route
          path="/user-payouts"
          element={
            <ProtectedRoute>
              <UserDashPayout />
             </ProtectedRoute>
          }
        />
        

        <Route
          path="/design-brief"
          element={
            <ProtectedRoute>
              <DesignDashRequirement />
             </ProtectedRoute>
          }
        />

      






      <Route 
          path="/auth" 
          element={
          <PublicRoute>
            <AuthForm />
          </PublicRoute>} 
      />

    <Route path="/reset-password/:token" element={<ResetPassword />} />



    {/* admin routes */}

    
    <Route path='/admin' element={<AdminLogin />} />

    <Route 
      path="/admin-signup" 
      element={
        <SuperAdminProtectedRoute>
          <AdminSignup />
        </SuperAdminProtectedRoute>
      } 
    />

    <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoutes>
              <AdminDashboard />
            </AdminProtectedRoutes>
          }
        />

      <Route
          path="/admin-profile"
          element={
            <AdminProtectedRoutes>
              <AdminProfileMain />
            </AdminProtectedRoutes>
          }
        />

 
        <Route
          path="/admin-allusers"
          element={
            <AdminProtectedRoutes>
              <AdminAllUsersMain/>
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin-briefs"
          element={
            <AdminProtectedRoutes>
              <AdminBreifsMain />
            </AdminProtectedRoutes>
          }
        />


        <Route
          path="/admin-category"
          element={
            <AdminProtectedRoutes>
              <Admincategorymain />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin-team"
          element={
            <AdminProtectedRoutes>
              <AdminTeamMain />
             </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin-all-designs"
          element={
            <AdminProtectedRoutes>
              <AllDesignsAdmin />
             </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin-withdrawals"
          element={
            <AdminProtectedRoutes>
              <AdminWithdrawalMain />
             </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin-support"
          element={
            <AdminProtectedRoutes>
              <AdminSupportMain />
             </AdminProtectedRoutes>
          }
        />

    <Route path="*" element={<NotFound />} />


      

    </Routes>

    <ScrollToTopButton />
    

    {!hideNavbarPaths.includes(location.pathname) && <Footer /> }



    

    <Toaster position="bottom-left" />


    </>
  )
}

export default App
