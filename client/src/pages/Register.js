import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Auth.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match"
      );

      return;

    }


    setLoading(true);


    try {

  console.log("1. About to fetch");

  const response = await fetch(
    "http://localhost:5050/api/register",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    }
  );

  console.log("2. Fetch completed");

  console.log(
    "STATUS:",
    response.status
  );

  console.log(
    "CONTENT TYPE:",
    response.headers.get("content-type")
  );


  const text =
    await response.text();

  console.log(
    "3. RAW SERVER RESPONSE:",
    text
  );


  let data;

  try {

    data = JSON.parse(text);

  } catch {

    throw new Error(
      "Backend did not return valid JSON: " + text
    );

  }


  console.log(
    "4. PARSED DATA:",
    data
  );


  if (!response.ok) {

    throw new Error(
      data.error ||
      "Registration failed"
    );

  }


  console.log(
    "5. REGISTRATION SUCCESS"
  );


  navigate("/login");

} catch (error) {

  console.error(
    "REGISTER ERROR:",
    error
  );

  console.error(
    "ERROR NAME:",
    error.name
  );

  console.error(
    "ERROR MESSAGE:",
    error.message
  );

  console.error(
    "ERROR STACK:",
    error.stack
  );

  setError(error.message);

}}

  return (

    <div className="auth-page">

      <div className="auth-container">


        {/* LEFT SIDE */}

        <div className="auth-brand">

          <div className="auth-brand-content">

            <div className="auth-logo">
              <span>✦</span>
              BizAgent AI
            </div>


            <h1>
              Build a smarter
              <br />
              business with AI.
            </h1>


            <p>
              Create your workspace and give
              BizAgent AI the knowledge it needs
              to understand your business.
            </p>


            <div className="auth-features">

              <div>
                <span>✓</span>
                Company-specific AI
              </div>

              <div>
                <span>✓</span>
                Business data analysis
              </div>

              <div>
                <span>✓</span>
                Intelligent recommendations
              </div>

            </div>

          </div>

        </div>



        {/* RIGHT SIDE */}

        <div className="auth-form-side">

          <div className="auth-form-box">

            <div className="auth-mobile-logo">
              ✦ BizAgent AI
            </div>


            <div className="auth-heading">

              <span className="auth-badge">
                GET STARTED
              </span>

              <h2>
                Create your account
              </h2>

              <p>
                Start building your AI-powered
                business workspace.
              </p>

            </div>


            {error && (

              <div className="auth-error">
                {error}
              </div>

            )}


            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >

              <div className="input-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                {
                  loading
                    ? "Creating account..."
                    : "Create Account →"
                }

              </button>

            </form>


            <div className="auth-switch">

              Already have an account?

              <Link to="/login">
                Sign in
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Register;