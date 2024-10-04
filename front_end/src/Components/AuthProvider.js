import { useContext, createContext } from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem("sHule") || "");
  const navigate = useNavigate();
  const loginAction = async (data) => {
    let status_code;

    const response = await fetch("http://127.0.0.1:8000/api/user/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    status_code = response.status;
    const res = await response.json();
    if (res.access) {
      const decoded_user = jwtDecode(res.access);
      console.log(decoded_user, "decoded", 222222222);
      setUser(decoded_user);
      setToken(res.access);
      localStorage.setItem("sHule", res.access);
      localStorage.setItem("sHule_user", JSON.stringify(decoded_user));

      navigate("/dashboard");
      return;
    }
    console.log(232323232, response);
    localStorage.setItem("sHule", "");
    throw new Error(res.detail);
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("sHule");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
