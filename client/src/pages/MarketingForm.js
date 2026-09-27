import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/MarketingForm.css";


function MarketingForm() {

  const navigate = useNavigate();

  const [campaign, setCampaign] = useState({
    campaign_name: "",
    spend: "",
    leads: "",
    conversions: "",
    revenue: "",
    start_date: "",
    end_date: ""
  });


  const handleChange = (e) => {

    setCampaign({
      ...campaign,
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
      `http://localhost:5050/api/setup-progress/${user.id}/marketing`
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


      const campaignData = {
        company_id: companyId,
        ...campaign
      };


      console.log(
        "MARKETING DATA:",
        campaignData
      );


      const response = await fetch(
        "http://localhost:5050/api/marketing",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            campaignData
          )
        }
      );


      const data =
        await response.json();


      console.log(
        "MARKETING RESPONSE:",
        data
      );


      if (!response.ok) {

        console.error(
          data.error
        );

        return;

      }


      console.log(
        "Campaign inserted successfully"
      );


      setCampaign({
        campaign_name: "",
        spend: "",
        leads: "",
        conversions: "",
        revenue: "",
        start_date: "",
        end_date: ""
      });


    } catch (error) {

      console.error(
        "MARKETING ERROR:",
        error
      );

    }

  };


  return (

    <div className="marketing-page">

      <div className="marketing-container">

        <div className="marketing-header">

          <span className="marketing-label">
            MARKETING DATA
          </span>

          <h2>Marketing Campaigns</h2>

          <p>
            Add your company's marketing campaign
            performance before continuing.
          </p>

        </div>


        <form
          className="marketing-form"
          onSubmit={handleSubmit}
        >

          <div className="marketing-group">

            <label>
              Campaign Name
            </label>

            <input
              type="text"
              name="campaign_name"
              placeholder="e.g. Summer Campaign"
              value={campaign.campaign_name}
              onChange={handleChange}
              required
            />

          </div>


          <div className="marketing-group">

            <label>
              Campaign Spend
            </label>

            <input
              type="number"
              name="spend"
              placeholder="e.g. 1000"
              value={campaign.spend}
              onChange={handleChange}
              required
            />

          </div>


          <div className="marketing-group">

            <label>
              Leads
            </label>

            <input
              type="number"
              name="leads"
              placeholder="e.g. 150"
              value={campaign.leads}
              onChange={handleChange}
              required
            />

          </div>


          <div className="marketing-group">

            <label>
              Conversions
            </label>

            <input
              type="number"
              name="conversions"
              placeholder="e.g. 25"
              value={campaign.conversions}
              onChange={handleChange}
              required
            />

          </div>


          <div className="marketing-group">

            <label>
              Revenue Generated
            </label>

            <input
              type="number"
              name="revenue"
              placeholder="e.g. 5000"
              value={campaign.revenue}
              onChange={handleChange}
              required
            />

          </div>


          <div className="marketing-group">

            <label>
              Start Date
            </label>

            <input
              type="date"
              name="start_date"
              value={campaign.start_date}
              onChange={handleChange}
              required
            />

          </div>


          <div className="marketing-group">

            <label>
              End Date
            </label>

            <input
              type="date"
              name="end_date"
              value={campaign.end_date}
              onChange={handleChange}
            />

          </div>


          <div className="marketing-actions">

            <button
              type="submit"
              className="marketing-add-button"
            >
              + Add Campaign
            </button>


            <button
  type="button"
  className="marketing-continue-button"
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

export default MarketingForm;