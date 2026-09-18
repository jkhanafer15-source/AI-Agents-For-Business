import React, {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import "../css/Auth.css";


function Login() {

  const navigate =
    useNavigate();


  const [email, setEmail] =
    useState("");


  const [password, setPassword] =
    useState("");


  const [error, setError] =
    useState("");


  const [loading, setLoading] =
    useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();


    setError("");

    setLoading(true);


    try {

      /* =========================
         SEND LOGIN REQUEST
      ========================= */

      const response = await fetch(
        "http://localhost:5050/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );


      /* =========================
         GET NODE RESPONSE
      ========================= */

      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Login failed"
        );

      }


      console.log(
        "LOGIN RESPONSE:",
        data
      );



      /* =========================
         SAVE USER
      ========================= */

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );


      console.log(
        "USER SAVED:",
        data.user
      );



      /* =========================
         GO TO HOME
      ========================= */

      navigate("/home");


    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );


      setError(
        error.message
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="auth-page">

      <div className="auth-container">


        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="auth-brand">

          <div className="auth-brand-content">


            <div className="auth-logo">

              <span>
                ✦
              </span>

              BizAgent AI

            </div>


            <h1>

              Your Business.

              <br />

              Smarter with AI.

            </h1>


            <p>

              Turn your business data into
              intelligent insights,
              recommendations and answers
              with AI.

            </p>


            <div className="auth-features">

              <div>

                <span>
                  ✓
                </span>

                AI-powered business assistant

              </div>


              <div>

                <span>
                  ✓
                </span>

                Intelligent business analysis

              </div>


              <div>

                <span>
                  ✓
                </span>

                Company-specific knowledge

              </div>

            </div>

          </div>

        </div>



        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="auth-form-side">

          <div className="auth-form-box">


            <div className="auth-mobile-logo">

              ✦ BizAgent AI

            </div>



            <div className="auth-heading">

              <span className="auth-badge">

                WELCOME BACK

              </span>


              <h2>

                Sign in to your account

              </h2>


              <p>

                Continue to your AI-powered
                business workspace.

              </p>

            </div>



            {/* ERROR */}

            {error && (

              <div className="auth-error">

                {error}

              </div>

            )}



            {/* LOGIN FORM */}

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >


              {/* EMAIL */}

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



              {/* PASSWORD */}

              <div className="input-group">

                <label>

                  Password

                </label>


                <input
                  type="password"

                  placeholder="Enter your password"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  required
                />

              </div>



              {/* OPTIONS */}

              <div className="auth-options">


                <label className="remember">

                  <input
                    type="checkbox"
                  />

                  Remember me

                </label>



                <button
                  type="button"
                  className="forgot-password"
                >

                  Forgot password?

                </button>

              </div>



              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                {
                  loading
                    ? "Signing in..."
                    : "Sign In →"
                }

              </button>

            </form>



            {/* REGISTER */}

            <div className="auth-switch">

              Don't have an account?

              <Link to="/register">

                Create account

              </Link>

            </div>


          </div>

        </div>

      </div>

    </div>

  );

}


export default Login;