import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/CustomerForm.css";


function CustomerForm() {

  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    customer_name: "",
    status: "",
    sentiment: "",
    joined_date: "",
    left_date: ""
  });


  const handleChange = (e) => {

    setCustomer({
      ...customer,
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
      `http://localhost:5050/api/setup-progress/${user.id}/customers`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

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

      const companyId =
        localStorage.getItem("company_id");


      const customerData = {
        company_id: companyId,
        ...customer
      };


      console.log(
        "CUSTOMER DATA:",
        customerData
      );


      const response = await fetch(
        "http://localhost:5050/api/customers",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            customerData
          )
        }
      );


      const data =
        await response.json();


      console.log(
        "CUSTOMER RESPONSE:",
        data
      );


      if (!response.ok) {

        console.error(
          data.error
        );

        return;

      }


      console.log(
        "Customer inserted successfully"
      );


      setCustomer({
        customer_name: "",
        status: "",
        sentiment: "",
        joined_date: "",
        left_date: ""
      });


    } catch (error) {

      console.error(
        "CUSTOMER ERROR:",
        error
      );

    }

  };


  return (

    <div className="customer-page">

      <div className="customer-container">

        <div className="customer-header">

          <span className="customer-label">
            CUSTOMER DATA
          </span>

          <h2>Customer Information</h2>

          <p>
            Add customer information for customer,
            sentiment and churn analysis.
          </p>

        </div>


        <form
          className="customer-form"
          onSubmit={handleSubmit}
        >

          <div className="customer-group">

            <label>
              Customer Name
            </label>

            <input
              type="text"
              name="customer_name"
              placeholder="Customer Name"
              value={customer.customer_name}
              onChange={handleChange}
              required
            />

          </div>


          <div className="customer-group">

            <label>
              Customer Status
            </label>

            <select
              name="status"
              value={customer.status}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="churned">
                Churned
              </option>

            </select>

          </div>


          <div className="customer-group">

            <label>
              Customer Sentiment
            </label>

            <select
              name="sentiment"
              value={customer.sentiment}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Sentiment
              </option>

              <option value="positive">
                Positive
              </option>

              <option value="neutral">
                Neutral
              </option>

              <option value="negative">
                Negative
              </option>

            </select>

          </div>


          <div className="customer-group">

            <label>
              Joined Date
            </label>

            <input
              type="date"
              name="joined_date"
              value={customer.joined_date}
              onChange={handleChange}
              required
            />

          </div>


          <div className="customer-group">

            <label>
              Left Date
            </label>

            <input
              type="date"
              name="left_date"
              value={customer.left_date}
              onChange={handleChange}
            />

          </div>


          <div className="customer-actions">

            <button
              type="submit"
              className="customer-add-button"
            >
              + Add Customer
            </button>


            <button
  type="button"
  onClick={continueSetup}
>
  Continue Business Setup →
</button>   

          </div>

        </form>

      </div>

    </div>

  );

}

export default CustomerForm;