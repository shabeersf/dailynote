import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Completed from "./pages/Completed";
import Expired from "./pages/Expired";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateEvent from "./pages/UpdateEvent";
import MyEvent from "./pages/MyEvent";
import Event from "./pages/Event"; // Import the Event component
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import ProfileEdit from "./pages/ProfileEdit";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AboutUs from "./pages/AboutUs";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwt");

    if (jwtToken) {
      try {
        const decodedToken = jwt_decode(jwtToken, {
          secret: "apple",
        });

        // console.log(decodedToken.id);
        setUserId(decodedToken.id);
        setLoggedIn(true);
      } catch (error) {
        console.error("Failed to decode/verify JWT token:", error);
        setLoggedIn(false);
      }
    }
  }, [loggedIn]);

  const handleLogout = () => {
    if (loggedIn) {
      sessionStorage.removeItem("jwt");
    }
    setLoggedIn(false);
    setUserId(null);
  };

  const RedirectToDashboard = () => {
    return <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <div className="w-full h-full flex flex-col justify-between min-h-screen">
        <Navbar loggedIn={loggedIn} handleLogout={handleLogout} userId={userId} />
        <Routes>
          {!loggedIn && <Route path="/" element={<Navigate to="/sign-in" />} />}
          {loggedIn ? (
            <>
              <Route path="/" element={<Dashboard userId={userId} />} />
              <Route
                path="/completed"
                element={<Completed userId={userId} />}
              />
              <Route path="/my-events" element={<MyEvent userId={userId} />} />
              <Route path="/expired" element={<Expired userId={userId} />} />
              <Route path="/add-event" element={<Event userId={userId} />} />
              <Route path="/reset-password" element={<Reset userId={userId} />} />
              <Route path="/my-profile" element={<ProfileEdit userId={userId} />} />
              <Route
                path="/update-event/:eventId"
                element={<UpdateEvent userId={userId} />}
              />
              <Route path="/sign-in" element={<RedirectToDashboard />} />
              <Route path="/register" element={<RedirectToDashboard />} />
            </>
          ) : (
            <>
              <Route
                path="/sign-in"
                element={<Login toggleLogin={() => setLoggedIn(true)} />}
              />
              <Route
                path="/register"
                element={<Register toggleLogin={() => setLoggedIn(true)} />}
              />
            </>
          )}
          <Route path="/privacy-policy" element={<Privacy/>} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
        <Footer />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
