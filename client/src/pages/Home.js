import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/Home.css";

function Home() {
    
  const navigate = useNavigate();

  return (
    <div className="home-page">

      <Navbar />

      <main className="home-container">

        {/* HERO SECTION */}

        <section className="hero-section">

          <div className="hero-content">

            <div className="hero-badge">
              ✦ AI-powered business intelligence
            </div>

            <h1>
              AI-Powered
              <br />

              <span>
                Business Assistant
              </span>
            </h1>

            <p className="hero-description">
              Ask questions about your business, analyze company
              data and get AI-powered insights that help you make
              smarter decisions.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-btn"
                onClick={() => navigate("/chat")}
              >
                Start AI Chat
                <span>→</span>
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/analytics")}
              >
                View Business Analysis
                <span>▥</span>
              </button>

            </div>

            <div className="hero-small-info">

              <div>
                <span className="check-icon">✓</span>
                RAG-powered responses
              </div>

              <div>
                <span className="check-icon">✓</span>
                AI business analysis
              </div>

              <div>
                <span className="check-icon">✓</span>
                Multi-agent insights
              </div>

            </div>

          </div>


          {/* HERO VISUAL */}

          <div className="hero-visual">

            <div className="background-circle circle-one"></div>
            <div className="background-circle circle-two"></div>

            <div className="floating-card card-chart">
              📊
            </div>

            <div className="floating-card card-chat">
              💬
            </div>

            <div className="floating-card card-document">
              📄
            </div>

            <div className="floating-card card-ai">
              ✨
            </div>

            <div className="robot-wrapper">

              <div className="robot-head">
                <div className="robot-screen">
                  <span className="robot-eye"></span>

                  <div className="robot-mouth">
                    ︶
                  </div>

                  <span className="robot-eye"></span>
                </div>
              </div>

              <div className="robot-body"></div>

              <div className="robot-shadow"></div>

            </div>

          </div>

        </section>


        {/* FEATURES */}

        <section className="features-section">

          <div className="feature-card">

            <div className="feature-icon purple">
              📄
            </div>

            <div>
              <h3>Business Knowledge</h3>

              <p>
                Upload your business documents and company data
                so the AI can understand your organization.
              </p>
            </div>

          </div>


          <div className="feature-card">

            <div className="feature-icon green">
              🤖
            </div>

            <div>
              <h3>AI Assistant</h3>

              <p>
                Ask questions about your business using an
                advanced RAG-powered chatbot.
              </p>
            </div>

          </div>


          <div className="feature-card">

            <div className="feature-icon orange">
              📊
            </div>

            <div>
              <h3>Smart Insights</h3>

              <p>
                Analyze business performance and receive
                AI-generated recommendations.
              </p>
            </div>

          </div>

        </section>


        {/* HOW IT WORKS */}

        <section className="how-section">

          <div className="section-heading">

            <span className="section-small-title">
              HOW IT WORKS
            </span>

            <h2>
              Turn business data into
              <span> smarter decisions</span>
            </h2>

            <p>
              BizAgent combines your company knowledge,
              AI reasoning and business analytics in one system.
            </p>

          </div>


          <div className="steps-container">

            <div className="step-card">

              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                📁
              </div>

              <h3>
                Upload Your Data
              </h3>

              <p>
                Add company documents, reports, CSV files,
                product information and customer data.
              </p>

            </div>


            <div className="step-connector">
              →
            </div>


            <div className="step-card">

              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                🧠
              </div>

              <h3>
                AI Understands
              </h3>

              <p>
                RAG retrieves relevant company information
                before generating the AI response.
              </p>

            </div>


            <div className="step-connector">
              →
            </div>


            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                📈
              </div>

              <h3>
                Get Recommendations
              </h3>

              <p>
                AI agents analyze different parts of the
                business and generate actionable insights.
              </p>

            </div>

          </div>

        </section>


        {/* SECURITY */}

        <section className="security-section">

          <div className="security-icon">
            🛡
          </div>

          <div>

            <h3>
              Your business data stays secure
            </h3>

            <p>
              Your company documents are used only to provide
              business-specific AI responses and analysis.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;