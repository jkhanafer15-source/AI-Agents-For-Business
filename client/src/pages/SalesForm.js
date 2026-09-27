import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/SalesForm.css";


function SalesForm() {

  const navigate = useNavigate();

  const [sale, setSale] = useState({
    product_name: "",
    quantity: "",
    unit_price: "",
    sale_date: ""
  });


  const handleChange = (e) => {

    setSale({
      ...sale,
      [e.target.name]: e.target.value
    });

  };

  const continueSetup = async () => {

  try {

    console.log("CONTINUE BUTTON CLICKED");

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    console.log("USER:", user);

    if (!user) {
      console.log("NO USER");
      navigate("/login");
      return;
    }

    console.log(
      "CALLING:",
      `http://localhost:5050/api/setup-progress/${user.id}/sales`
    );

    const response = await fetch(
      `http://localhost:5050/api/setup-progress/${user.id}/sales`
    );

    console.log(
      "STATUS:",
      response.status
    );

    const data = await response.json();

    console.log(
      "SETUP DATA:",
      data
    );

    if (!response.ok) {

      console.error(
        "API ERROR:",
        data.error
      );

      return;
    }

    if (data.company_id) {

      localStorage.setItem(
        "company_id",
        data.company_id
      );

    }

    console.log(
      "NAVIGATING TO:",
      data.next
    );

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


      const saleData = {
        company_id: companyId,
        ...sale
      };


      console.log(
        "SALE DATA:",
        saleData
      );


      const response = await fetch(
        "http://localhost:5050/api/sales",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            saleData
          )
        }
      );


      const data =
        await response.json();


      console.log(
        "SALES RESPONSE:",
        data
      );


      if (!response.ok) {

        console.error(
          data.error
        );

        return;

      }


      console.log(
        "Sale inserted successfully"
      );


      setSale({
        product_name: "",
        quantity: "",
        unit_price: "",
        sale_date: ""
      });


    } catch (error) {

      console.error(
        "SALES ERROR:",
        error
      );

    }

  };


  return (

    <div className="sales-page">

      <div className="sales-container">

        <div className="sales-header">

          <span className="sales-label">
            SALES DATA
          </span>

          <h2>Sales Information</h2>

          <p>
            Add your company's sales records.
            You can add multiple sales before continuing.
          </p>

        </div>


        <form
          className="sales-form"
          onSubmit={handleSubmit}
        >

          <div className="sales-group">

            <label>
              Product Name
            </label>

            <input
              type="text"
              name="product_name"
              placeholder="e.g. Website Development"
              value={sale.product_name}
              onChange={handleChange}
              required
            />

          </div>


          <div className="sales-group">

            <label>
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              placeholder="e.g. 2"
              value={sale.quantity}
              onChange={handleChange}
              required
            />

          </div>


          <div className="sales-group">

            <label>
              Unit Price
            </label>

            <input
              type="number"
              name="unit_price"
              placeholder="e.g. 1500"
              value={sale.unit_price}
              onChange={handleChange}
              required
            />

          </div>


          <div className="sales-group">

            <label>
              Sale Date
            </label>

            <input
              type="date"
              name="sale_date"
              value={sale.sale_date}
              onChange={handleChange}
              required
            />

          </div>


          <div className="sales-actions">

            <button
              type="submit"
              className="sales-add-button"
            >
              + Add Sale
            </button>


            <button
  type="button"
  className="sales-continue-button"
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

export default SalesForm;