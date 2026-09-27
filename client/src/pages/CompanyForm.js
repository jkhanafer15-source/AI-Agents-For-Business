import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/CompanyForm.css";


function CompanyForm() {
const navigate = useNavigate();

  const [company, setCompany] = useState({
    company_name: "",
    business_type: "",
    description: "",
    products_services: "",
    target_customers: "",
    location: "",
    goals: "",
    problems: ""
  });

  const user = JSON.parse(
  localStorage.getItem("user")
);

const userId = user.id;

  const handleChange = (e) => {

    setCompany({
       user_id: userId,
      ...company,
      [e.target.name]: e.target.value
    });

  };

const continueSetup = async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user")
    );


    if (!user) {
      navigate("/login");
      return;
    }


    const response = await fetch(
      `http://localhost:5050/api/setup-progress/${user.id}/sales`
    );


    const data =
      await response.json();


    if (!response.ok) {
      console.error(data.error);
      return;
    }


    // Keep company ID available
    if (data.company_id) {

      localStorage.setItem(
        "company_id",
        data.company_id
      );

    }


    navigate(data.next);


  } catch (error) {

    console.error(
      "SETUP PROGRESS ERROR:",
      error
    );

  }

};
  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const userId = user.id;


    const companyData = {
      user_id: userId,
      ...company
    };


    console.log(
      "SENDING:",
      companyData
    );


    const response = await fetch(
      "http://localhost:5050/api/companys",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify(
          companyData
        )
      }
    );


    const data =
      await response.json();


    console.log(
      "SERVER RESPONSE:",
      data
    );

    if (!response.ok) {
  console.error(data.error);
  return;
}

localStorage.setItem(
  "company_id",
  data.company_id
);
// Company saved successfully
    navigate("/sales");
  } catch (error) {

    console.error(error);

  }

};

  return (

  <div className="company-page">


      

    <div className="company-form-container">

      <div className="company-form-header">
        <span className="company-label">
          BUSINESS PROFILE
        </span>

        <h2>Company Information</h2>

        <p>
          Tell BizAgent AI about your business so we can
          provide relevant business insights.
        </p>
      </div>

      <form
        className="company-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label>Company Name</label>

          <input
            type="text"
            name="company_name"
            placeholder="Company Name"
            value={company.company_name}
            onChange={handleChange}
          />
        </div>


        <div className="form-group">
          <label>Business Type</label>

          <input
            type="text"
            name="business_type"
            placeholder="Business Type"
            value={company.business_type}
            onChange={handleChange}
          />
        </div>


        <div className="form-group full-width">
          <label>Company Description</label>

          <textarea
            name="description"
            placeholder="Company Description"
            value={company.description}
            onChange={handleChange}
          />
        </div>


        <div className="form-group full-width">
          <label>Products or Services</label>

          <textarea
            name="products_services"
            placeholder="Products or Services"
            value={company.products_services}
            onChange={handleChange}
          />
        </div>


        <div className="form-group">
          <label>Target Customers</label>

          <textarea
            name="target_customers"
            placeholder="Target Customers"
            value={company.target_customers}
            onChange={handleChange}
          />
        </div>


        <div className="form-group">
          <label>Location</label>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={company.location}
            onChange={handleChange}
          />
        </div>


        <div className="form-group">
          <label>Business Goals</label>

          <textarea
            name="goals"
            placeholder="Business Goals"
            value={company.goals}
            onChange={handleChange}
          />
        </div>


        <div className="form-group">
          <label>Current Problems</label>

          <textarea
            name="problems"
            placeholder="Current Problems"
            value={company.problems}
            onChange={handleChange}
          />
        </div>
<div className="form-actions">
<button onClick={continueSetup}>
  Continue Business Setup →
</button></div>
        <div className="form-actions">
          <button type="submit">
            Save Company
            <span>→</span>
          </button>
        </div>

      </form>

    </div>

  </div>
);}

export default CompanyForm;