import React, {
  useState
} from "react";

import Navbar from "../components/Navbar";
import "../css/Analysis.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import {
  Line,
  Bar,
  Doughnut,
} from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);


function Analysis() {


  /* ===============================
     STATE
  =============================== */

  const [analysisData, setAnalysisData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* ===============================
     RUN AI ANALYSIS
  =============================== */

  const runAnalysis = async () => {

    try {

      setLoading(true);
      setError("");


      const user = JSON.parse(
        localStorage.getItem("user")
      );


      if (!user) {

        setError(
          "User not found. Please login."
        );

        return;

      }


      const userId =
        user.id;


      const response = await fetch(
        `http://localhost:5050/api/analysis/${userId}`
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to run analysis"
        );

      }


      setAnalysisData(
        data
      );


    } catch (error) {

      console.error(
        "ANALYSIS ERROR:",
        error
      );

      setError(
        error.message
      );


    } finally {

      setLoading(false);

    }

  };


  /* ===============================
     FIRST PAGE / NO ANALYSIS YET
  =============================== */

  if (!analysisData) {

    return (

      <div className="analysis-page">

        <Navbar />


        <main className="analysis-container">


          <section className="analysis-header">

            <div>

              <span className="analysis-small-title">
                AI BUSINESS INTELLIGENCE
              </span>


              <h1>
                Business Analysis
              </h1>


              <p>
                Analyze business performance,
                discover problems and receive
                AI-powered recommendations.
              </p>

            </div>


            <div className="analysis-actions">

              <select>

                <option>
                  Last 30 Days
                </option>

                <option>
                  Last 3 Months
                </option>

                <option>
                  Last 6 Months
                </option>

                <option>
                  This Year
                </option>

              </select>


              <button
                className="run-analysis-button"
                onClick={runAnalysis}
                disabled={loading}
              >

                {loading
                  ? "✦ Running AI Analysis..."
                  : "✦ Run AI Analysis"}

              </button>

            </div>

          </section>


          {error && (

            <p>
              {error}
            </p>

          )}


          {!loading && !error && (

            <div className="insight-card">

              <div className="insight-heading">

                <div>

                  <h3>
                    Ready to analyze your business
                  </h3>

                  <p>
                    Click Run AI Analysis to start
                    the multi-agent business
                    evaluation.
                  </p>

                </div>

              </div>

            </div>

          )}


          {loading && (

            <div className="insight-card">

              <div className="insight-heading">

                <div>

                  <h3>
                    AI agents are analyzing
                    your business...
                  </h3>

                  <p>
                    Sales, customers, products
                    and marketing are currently
                    being evaluated.
                  </p>

                </div>

              </div>

            </div>

          )}


        </main>

      </div>

    );

  }


  /* ===============================
     GET DATA FROM API
  =============================== */

  const analysis =
    analysisData.analysis;


  const charts =
    analysis.charts;


  const kpis =
    analysis.kpis;


  const agentResults =
    analysis.agents;


  const evaluation =
    analysis.business_evaluation;


  /* ===============================
     FINAL EVALUATION DATA
  =============================== */

  const businessScore =
    evaluation.overall_score;


  const businessStatus =
    evaluation.overall_status;


  const businessSummary =
    evaluation.summary;


  const strengths =
    evaluation.strengths || [];


  const problems =
    evaluation.problems || [];


  const recommendations =
    evaluation.recommendations || [];


  const revenueGrowth =
    Number(
      kpis.revenue_growth || 0
    );


  /* ===============================
     KPI DATA
  =============================== */

  const metrics = [

    {
      title: "Total Revenue",

      value:
        "$" +
        Number(
          kpis.total_revenue
        ).toLocaleString(),

      icon: "💰",
    },


    {
      title: "Total Customers",

      value:
        Number(
          kpis.total_customers
        ).toLocaleString(),

      icon: "👥",
    },


    {
      title: "Total Orders",

      value:
        Number(
          kpis.total_orders
        ).toLocaleString(),

      icon: "📦",
    },


    {
      title: "Customer Churn",

      value:
        Number(
          kpis.churn_rate
        ).toFixed(2) + "%",

      icon: "📉",
    },

  ];


  /* ===============================
     REVENUE CHART
  =============================== */

  const monthlyRevenue =
    charts.monthly_revenue || {};


  const revenueData = {

    labels:
      Object.keys(
        monthlyRevenue
      ),

    datasets: [
      {

        label: "Revenue",

        data:
          Object.values(
            monthlyRevenue
          ),

        borderColor:
          "#6c4cff",

        backgroundColor:
          "rgba(108, 76, 255, 0.10)",

        fill: true,

        tension: 0.4,

        borderWidth: 3,

        pointRadius: 4,

        pointBackgroundColor:
          "#6c4cff",

      },
    ],

  };


  const revenueOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false,
      },

    },

    scales: {

      y: {

        beginAtZero: false,

        grid: {
          color: "#f0eff6",
        },

        ticks: {

          callback: function (value) {

            return (
              "$" +
              value / 1000 +
              "k"
            );

          },

        },

      },


      x: {

        grid: {
          display: false,
        },

      },

    },

  };


  /* ===============================
     PRODUCT CHART
  =============================== */

  const productRevenue =
    charts.product_revenue || {};


  const productData = {

    labels:
      Object.keys(
        productRevenue
      ),

    datasets: [
      {

        label: "Revenue",

        data:
          Object.values(
            productRevenue
          ),

        backgroundColor: [
          "#6c4cff",
          "#8b73f6",
          "#b2a3fa",
          "#7f67ec",
          "#9d89f5",
        ],

        borderRadius: 7,

      },
    ],

  };


  const productOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false,
      },

    },

    scales: {

      y: {

        beginAtZero: true,

        grid: {
          color: "#f0eff6",
        },

        ticks: {

          callback: function (value) {

            return (
              "$" +
              value / 1000 +
              "k"
            );

          },

        },

      },


      x: {

        grid: {
          display: false,
        },

      },

    },

  };


  /* ===============================
     CUSTOMER SENTIMENT
  =============================== */

  const sentiment =
    charts.customer_sentiment || {};


  const sentimentData = {

    labels:
      Object.keys(
        sentiment
      ),

    datasets: [
      {

        data:
          Object.values(
            sentiment
          ),

        backgroundColor: [
          "#35c987",
          "#f3bc4b",
          "#f16b6b",
        ],

        borderWidth: 0,

      },
    ],

  };


  const sentimentOptions = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: "72%",

    plugins: {

      legend: {

        position: "bottom",

        labels: {

          usePointStyle: true,

          boxWidth: 8,

          padding: 18,

        },

      },

    },

  };


  /* ===============================
     AI AGENT DATA
  =============================== */

  const agents = [

    {
      name:
        "Sales Agent",

      score:
        agentResults.sales.score,

      icon:
        "📈",

      status:
        agentResults.sales.status,

      text:
        agentResults.sales.summary,
    },


    {
      name:
        "Customer Agent",

      score:
        agentResults.customer.score,

      icon:
        "👥",

      status:
        agentResults.customer.status,

      text:
        agentResults.customer.summary,
    },


    {
      name:
        "Marketing Agent",

      score:
        agentResults.marketing.score,

      icon:
        "📣",

      status:
        agentResults.marketing.status,

      text:
        agentResults.marketing.summary,
    },


    {
      name:
        "Product Agent",

      score:
        agentResults.product.score,

      icon:
        "📦",

      status:
        agentResults.product.status,

      text:
        agentResults.product.summary,
    },

  ];


  /* ===============================
     PAGE
  =============================== */

  return (

    <div className="analysis-page">

      <Navbar />


      <main className="analysis-container">


        {/* =========================
            HEADER
        ========================= */}

        <section className="analysis-header">

          <div>

            <span className="analysis-small-title">
              AI BUSINESS INTELLIGENCE
            </span>


            <h1>
              Business Analysis
            </h1>


            <p>
              Analyze business performance,
              discover problems and receive
              AI-powered recommendations.
            </p>

          </div>


          <div className="analysis-actions">

            <select>

              <option>
                Last 30 Days
              </option>

              <option>
                Last 3 Months
              </option>

              <option>
                Last 6 Months
              </option>

              <option>
                This Year
              </option>

            </select>


            <button
              className="run-analysis-button"
              onClick={runAnalysis}
              disabled={loading}
            >

              {loading
                ? "✦ Running AI Analysis..."
                : "✦ Run AI Analysis"}

            </button>

          </div>

        </section>


        {error && (

          <p>
            {error}
          </p>

        )}


        {/* =========================
            KPI CARDS
        ========================= */}

        <section className="metrics-grid">

          {metrics.map(
            (metric, index) => (

              <div
                className="metric-card"
                key={index}
              >

                <div className="metric-top">

                  <div className="metric-icon">

                    {metric.icon}

                  </div>

                </div>


                <span className="metric-title">

                  {metric.title}

                </span>


                <h2>

                  {metric.value}

                </h2>

              </div>

            )
          )}

        </section>


        {/* =========================
            REAL BUSINESS SCORE
        ========================= */}

        <section className="business-score-card">

          <div className="score-circle">

            <div className="score-content">

              <strong>
                {businessScore}
              </strong>

              <span>
                / 100
              </span>

            </div>

          </div>


          <div className="score-information">

            <span className="score-label">
              AI BUSINESS SCORE
            </span>


            <h2>
              Business Performance:
              {" "}
              {businessStatus}
            </h2>


            <p>
              {businessSummary}
            </p>


            <div className="score-badges">

              {strengths
                .slice(0, 2)
                .map(
                  (strength, index) => (

                    <span key={index}>

                      ✓ {strength}

                    </span>

                  )
                )}


              {problems.length > 0 && (

                <span className="warning">

                  ! {problems[0]}

                </span>

              )}

            </div>

          </div>


          <div className="score-status">

            <span>
              Overall Status
            </span>


            <strong>
              {businessStatus}
            </strong>

          </div>

        </section>


        {/* =========================
            REVENUE + SENTIMENT
        ========================= */}

        <section className="charts-grid">


          <div className="chart-card revenue-chart">

            <div className="card-heading">

              <div>

                <h3>
                  Revenue Performance
                </h3>

                <p>
                  Monthly revenue growth
                </p>

              </div>


              <div className="chart-stat">

                <strong>

                  {revenueGrowth > 0
                    ? "+"
                    : ""}

                  {revenueGrowth}%

                </strong>


                <span>
                  Growth
                </span>

              </div>

            </div>


            <div className="chart-container">

              <Line
                data={revenueData}
                options={revenueOptions}
              />

            </div>

          </div>


          <div className="chart-card sentiment-chart">

            <div className="card-heading">

              <div>

                <h3>
                  Customer Sentiment
                </h3>

                <p>
                  Based on customer feedback
                </p>

              </div>

            </div>


            <div className="sentiment-container">

              <Doughnut
                data={sentimentData}
                options={sentimentOptions}
              />


              <div className="sentiment-score">

                <strong>

                  {Number(
                    sentiment.positive || 0
                  ).toFixed(2)}%

                </strong>


                <span>
                  Positive
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            PRODUCT PERFORMANCE
        ========================= */}

        <section className="chart-card product-performance">

          <div className="card-heading">

            <div>

              <h3>
                Product Performance
              </h3>

              <p>
                Revenue generated by each product
              </p>

            </div>


            <button className="small-button">

              View Details

            </button>

          </div>


          <div className="product-chart-container">

            <Bar
              data={productData}
              options={productOptions}
            />

          </div>

        </section>


        {/* =========================
            AI AGENTS
        ========================= */}

        <section className="agents-section">

          <div className="section-title">

            <div>

              <span>
                MULTI-AGENT ANALYSIS
              </span>


              <h2>
                AI Agent Evaluation
              </h2>


              <p>
                Specialized AI agents evaluate
                different areas of your business.
              </p>

            </div>

          </div>


          <div className="agents-grid">

            {agents.map(
              (agent, index) => (

                <div
                  className="agent-card"
                  key={index}
                >

                  <div className="agent-card-top">

                    <div className="agent-icon">

                      {agent.icon}

                    </div>


                    <div
                      className={
                        agent.score >= 80
                          ? "agent-status healthy"
                          : agent.score >= 75
                          ? "agent-status good"
                          : "agent-status attention"
                      }
                    >

                      {agent.status}

                    </div>

                  </div>


                  <h3>
                    {agent.name}
                  </h3>


                  <div className="agent-score-row">

                    <strong>
                      {agent.score}
                    </strong>

                    <span>
                      /100
                    </span>

                  </div>


                  <div className="progress-bar">

                    <div
                      className="progress-value"
                      style={{
                        width:
                          agent.score + "%",
                      }}
                    >
                    </div>

                  </div>


                  <p>
                    {agent.text}
                  </p>

                </div>

              )
            )}

          </div>

        </section>


        {/* =========================
            PROBLEMS + STRENGTHS
        ========================= */}

        <section className="insights-grid">


          <div className="insight-card">

            <div className="insight-heading">

              <div className="insight-icon problem">
                ⚠
              </div>


              <div>

                <h3>
                  Problems Detected
                </h3>

                <p>
                  Areas that need attention
                </p>

              </div>

            </div>


            <div className="problem-list">

              {problems.length > 0 ? (

                problems.map(
                  (problem, index) => (

                    <div
                      className="problem-item"
                      key={index}
                    >

                      <div>

                        <strong>
                          {problem}
                        </strong>

                      </div>


                      <span className="high-badge">
                        AI
                      </span>

                    </div>

                  )
                )

              ) : (

                <div className="problem-item">

                  <div>

                    <strong>
                      No major problems detected.
                    </strong>

                  </div>

                </div>

              )}

            </div>

          </div>


          <div className="insight-card">

            <div className="insight-heading">

              <div className="insight-icon strength">
                ✓
              </div>


              <div>

                <h3>
                  Business Strengths
                </h3>

                <p>
                  Areas performing strongly
                </p>

              </div>

            </div>


            <div className="strength-list">

              {strengths.length > 0 ? (

                strengths.map(
                  (strength, index) => (

                    <div
                      className="strength-item"
                      key={index}
                    >

                      <span>
                        ✓
                      </span>


                      <div>

                        <strong>
                          {strength}
                        </strong>

                      </div>

                    </div>

                  )
                )

              ) : (

                <div className="strength-item">

                  <span>
                    ✓
                  </span>


                  <div>

                    <strong>
                      No strengths were identified.
                    </strong>

                  </div>

                </div>

              )}

            </div>

          </div>

        </section>


        {/* =========================
            RECOMMENDATIONS
        ========================= */}

        <section className="recommendation-section">

          <div className="recommendation-header">

            <div>

              <span>
                ✦ AI RECOMMENDATIONS
              </span>


              <h2>
                Recommended Actions
              </h2>


              <p>
                Actions generated after evaluating
                business performance across all
                analysis agents.
              </p>

            </div>


            <div className="powered-agent">

              Multi-Agent Analysis

            </div>

          </div>


          <div className="recommendations-list">

            {recommendations.length > 0 ? (

              recommendations.map(
                (recommendation, index) => (

                  <div
                    className="recommendation-card"
                    key={index}
                  >

                    <div className="recommendation-number">

                      {index + 1}

                    </div>


                    <div className="recommendation-content">

                      <span className="priority high">

                        AI Recommendation

                      </span>


                      <h3>

                        Recommended Action
                        {" "}
                        {index + 1}

                      </h3>


                      <p>
                        {recommendation}
                      </p>

                    </div>


                    <button className="recommendation-arrow">

                      →

                    </button>

                  </div>

                )
              )

            ) : (

              <div className="recommendation-card">

                <div className="recommendation-content">

                  <p>
                    No recommendations were generated.
                  </p>

                </div>

              </div>

            )}

          </div>

        </section>


      </main>

    </div>

  );

}


export default Analysis;