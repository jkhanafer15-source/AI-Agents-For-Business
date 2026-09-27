import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Analysis from "./pages/Analysis";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanyForm from "./pages/CompanyForm";
import SalesForm from "./pages/SalesForm";
import MarketingForm from "./pages/MarketingForm";
import CustomerForm from "./pages/CustomerForm";

function App() {
  return (
    <BrowserRouter>

      <Routes>


         <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
  path="/sales"
  element={<SalesForm />}
/>

<Route
  path="/marketing"
  element={<MarketingForm />}
/>

<Route
  path="/customers"
  element={<CustomerForm />}
/>

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/chat"
          element={<Chat />}
        />

        <Route
          path="/analytics"
          element={<Analysis />}
        />

<Route path="/company" element={<CompanyForm />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;