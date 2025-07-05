import { Navigate, Route, Routes } from "react-router-dom"
import NavBar from "./components/NavBar"
import HomePage from "./pages/HomePage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import SignUpPage from "./pages/SignUpPage"
import { useThemeStore } from "./store/useThemeStore"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"

const App = () => {
  const { authUser, checkAuth , isCheckingAuth  } = useAuthStore();
  const { theme } = useThemeStore();
  

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader className="size-10 animate-spin text-blue-50"/>
      </div>  
    )
  }

  return (
    <div data-theme={theme}>
      <NavBar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path="/signup" element={authUser ? <Navigate to='/' /> : <SignUpPage />} />
        <Route path="/login" element={authUser ? <Navigate to='/' /> : <LoginPage />} />
        <Route path="/themes" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App