import "./App.css";
import NavBar from "./Components/navBar";
import { Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/registerTeacher";
import FeeAndPayment from "./Components/FeeAndPayment.js";
import PaymentsPerStudent from "./Components/PaymentPerStudent";
import Dashboard from "./pages/dashboard.js";
import RegisterGrade from "./Components/registerGrade.js";
import RegisterSchool from "./Components/registerSchool.js";
import RegisterStudent from "./Components/registerStudent.js";
import CreateFee from "./Components/create_fee.js";
import RegisterPayment from "./Components/addPayment.js";
import AuthProvider from "./Components/AuthProvider.js";
import PrivateRoute from "./Components/PrivateRoute.js";
import { SearchResults } from "./Components/searchBar.js";
import { GetPaymentDetails } from "./Components/searchBar.js";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="register-grade" element={<RegisterGrade />} />
            <Route path="register-school" element={<RegisterSchool />} />
            <Route path="register-student" element={<RegisterStudent />} />
            <Route path="create-fee" element={<CreateFee />} />
            <Route path="register-payment" element={<RegisterPayment />} />
            <Route
              path="/fee/:feeName/:feeId/:feeToPay"
              element={<FeeAndPayment />}
            />
            <Route
              path="/payments/:feeName/:feeId/:studentID"
              element={<PaymentsPerStudent />}
            />
            <Route
              path="/searchResult/:searchInput"
              element={<SearchResults />}
            />
            <Route
              path="/get-payment-details/:id"
              element={<GetPaymentDetails />}
            />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
