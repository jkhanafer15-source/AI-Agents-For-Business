const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const db = require("./database");

dotenv.config();

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());


// ===============================
// TEST API
// ===============================

app.get("/", (req, res) => {
  console.log("ROOT API CALLED");
  res.send("SERVER IS WORKING");
});


// ===============================
// CHAT API
// ===============================

app.post(
  "/api/chat",
  async (req, res) => {

    try {

      const {
        user_id,
        message
      } = req.body;


      if (!message) {

        return res.status(400).json({
          error:
            "Message is required",
        });

      }


      await db.execute(
  `
  INSERT INTO messages
  (user_id,sender, text)
  VALUES (?,?, ?)
  `,
  [
    user_id,
    "user",
    message
  ]
);

      // =========================
      // SEND MESSAGE TO OPENAI
      // =========================

      const response = await fetch(
  "http://localhost:11434/api/chat",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      model: "llama3.2:3b",

      messages: [
        {
          role: "system",
          content: `
You are BizAgent AI.

You are an AI business assistant.

Help users with:
- sales
- marketing
- customers
- products
- business strategy
- business performance

Give clear and practical answers.
          `
        },

        {
          role: "user",
          content: message
        }
      ],

      stream: false
    })
  }
);

const data = await response.json();

const aiAnswer =
  data.message.content;

        await db.execute(
  `
  INSERT INTO messages
  (user_id,sender, text)
  VALUES (?,?, ?)
  `,
  [
    user_id,
    "ai",
    aiAnswer
  ]
);

      // =========================
      // SEND RESPONSE TO REACT
      // =========================

      res.json({

        sender:
          "ai",

        text:
          aiAnswer,

      });


    } catch (error) {

      console.error(error);


      res.status(500).json({

        error:
          "Failed to generate AI response",

      });

    }

  }
);


// ===============================
// SERVER
// ===============================

const PORT = 5050;


app.listen(
  PORT,
  () => {

    console.log(
      `Server running on http://localhost:${PORT}`
    );

  }
);

app.get("/api/messages/:userId", async (req, res) => {

  try {

    const userId =
        req.params.userId;
    const [rows] = await db.execute(
      `
      SELECT *
      FROM messages
      WHERE user_id = ?
      ORDER BY id ASC
      `
      ,
          [userId]
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to get messages"
    });

  }

});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT 1 AS test"
    );

    res.json(rows);

  } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
      error: error.message
    });
  }
});


app.get("/api/test-ollama", async (req, res) => {

  try {

    console.log("Testing Ollama...");

    const response =
      await fetch(
        "http://localhost:11434/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            model: "llama3.2:3b",

            messages: [
              {
                role: "user",
                content:
                  "Say hello in one short sentence."
              }
            ],

            stream: false

          })
        }
      );


    const data =
      await response.json();


    res.json({
      success: true,
      answer:
        data.message.content
    });


  } catch (error) {

    console.error(
      "OLLAMA TEST ERROR:",
      error
    );


    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

});

app.post("/api/company", async (req, res) => {

  try {

    const {
      company_name,
      business_type,
      description,
      products_services,
      target_customers,
      location,
      goals,
      problems
    } = req.body;


    if (!company_name || !business_type) {

      return res.status(400).json({
        error:
          "Company name and business type are required"
      });

    }


    const [result] = await db.execute(
      `
      INSERT INTO companies
      (
        company_name,
        business_type,
        description,
        products_services,
        target_customers,
        location,
        goals,
        problems
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        company_name,
        business_type,
        description,
        products_services,
        target_customers,
        location,
        goals,
        problems
      ]
    );


    const companyId = result.insertId;


    const aiResponse = await fetch(
      "http://localhost:8000/company/index",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          company_id: companyId,
          company_name,
          business_type,
          description,
          products_services,
          target_customers,
          location,
          goals,
          problems
        })
      }
    );


    const aiData =
      await aiResponse.json();


    res.json({
      success: true,

      company_id:
        companyId,

      message:
        "Company saved successfully",

      vector_database:
        aiData
    });


  } catch (error) {

    console.error(
      "COMPANY ERROR:",
      error
    );


    res.status(500).json({
      error:
        "Failed to save company"
    });

  }

});


app.post("/api/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;


    if (!name || !email || !password) {

      return res.status(400).json({
        error: "All fields are required"
      });

    }


    // Check if email already exists

    const [existingUsers] = await db.execute(
      `
      SELECT id
      FROM users
      WHERE email = ?
      `,
      [email]
    );


    if (existingUsers.length > 0) {

      return res.status(409).json({
        error: "Email already registered"
      });

    }


    // Hash password

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // Insert user

    const [result] = await db.execute(
      `
      INSERT INTO users
      (name, email, password)
      VALUES (?, ?, ?)
      `,
      [
        name,
        email,
        hashedPassword
      ]
    );


    return res.status(201).json({

      success: true,

      message:
        "User registered successfully",

      user_id:
        result.insertId

    });


  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      error: error.message
    });

  }

});

app.post("/api/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    if (!email || !password) {

      return res.status(400).json({
        error: "Email and password are required"
      });

    }


    // Find user by unique email

    const [users] = await db.execute(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email]
    );


    // User doesn't exist

    if (users.length === 0) {

      return res.status(401).json({
        error: "Invalid email or password"
      });

    }


    // Get the user

    const user = users[0];


    // Compare entered password with hashed password

    const passwordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordCorrect) {

      return res.status(401).json({
        error: "Invalid email or password"
      });

    }


    // Successful login

    return res.json({

      success: true,

      message: "Login successful",

      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }

    });


  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      error: error.message
    });

  }

});
//for getting the userid to make filter for the companies and send the userid in users = to userid in companies and then send the id to fastapi to send it to chroma metadata to work as an filter
app.get(
  "/api/company/user/:userId",
  async (req, res) => {

    try {

      const userId =
        req.params.userId;

      const [companies] =
        await db.execute(
          `
          SELECT *
          FROM companies
          WHERE user_id = ?
          `,
          [userId]
        );

      if (companies.length === 0) {
        return res.status(404).json({
          error: "Company not found"
        });
      }

      res.json(companies[0]);

      const companyId = companies[0].id;


      const aiResponse = await fetch(
  "http://localhost:8000/chat",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      company_id: companyId,
      question: message
    })
  }
);

const aiData = await aiResponse.json();

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: error.message
      });

    }

  }
);


app.get(
  "/api/analysis/:userId",
  async (req, res) => {

    try {

      const userId =
        req.params.userId;


      console.log(
        "ANALYSIS USER ID:",
        userId
      );


      // =========================
      // FIND USER COMPANY
      // =========================

      const [companies] =
        await db.execute(
          `
          SELECT *
          FROM companies
          WHERE user_id = ?
          `,
          [userId]
        );


      if (companies.length === 0) {

        return res.status(404).json({
          error: "Company not found"
        });

      }


      const companyId =
        companies[0].id;


      console.log(
        "COMPANY ID:",
        companyId
      );



      // =========================
      // GET SALES
      // =========================

      const [sales] =
        await db.execute(
          `
          SELECT
            product_name,
            quantity,
            unit_price,
            sale_date
          FROM sales
          WHERE company_id = ?
          ORDER BY sale_date ASC
          `,
          [companyId]
        );


      if (sales.length === 0) {

        return res.status(404).json({
          error: "No sales data found"
        });

      }



      // =========================
      // GET CUSTOMERS
      // =========================

      const [customers] =
        await db.execute(
          `
          SELECT
            customer_name,
            status,
            sentiment,
            joined_date,
            left_date
          FROM customers
          WHERE company_id = ?
          ORDER BY joined_date ASC
          `,
          [companyId]
        );



      // =========================
      // GET MARKETING
      // =========================

      const [marketing] =
        await db.execute(
          `
          SELECT
            campaign_name,
            spend,
            leads,
            conversions,
            revenue,
            start_date,
            end_date
          FROM marketing_campaigns
          WHERE company_id = ?
          ORDER BY start_date ASC
          `,
          [companyId]
        );



      console.log(
        "SALES:",
        sales
      );

      console.log(
        "CUSTOMERS:",
        customers
      );

      console.log(
        "MARKETING:",
        marketing
      );



      // =========================
      // SEND DATA TO FASTAPI
      // =========================

      console.log(
        "SENDING DATA TO FASTAPI..."
      );


      const aiResponse =
        await fetch(
          "http://localhost:8000/business/analyze",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              company_id:
                companyId,

              sales:
                sales,

              customers:
                customers,

              marketing:
                marketing

            })
          }
        );



      // =========================
      // GET FASTAPI RESPONSE
      // =========================

      const aiData =
        await aiResponse.json();


      console.log(
        "FASTAPI RESPONSE:",
        aiData
      );


      if (!aiResponse.ok) {

        return res
          .status(aiResponse.status)
          .json(aiData);

      }

      console.log(
  "SENDING ANALYSIS TO REACT"
);

      // =========================
      // RETURN TO REACT
      // =========================

      return res.json({

        company_id:
          companyId,

        analysis:
          aiData

      });


    } catch (error) {

      console.error(
        "ANALYSIS ERROR:",
        error
      );


      return res.status(500).json({

        error:
          error.message

      });

    }

  }
);

app.listen(
  5050,
  () => {

    console.log(
      "Server running on port 5050"
    );

  }
);

app.delete(
  "/api/messages/:userId",
  async (req, res) => {

    try {

      const userId =
        req.params.userId;

      await db.execute(
        `
        DELETE FROM messages
        WHERE user_id = ?
        `,
        [userId]
      );

      return res.json({
        success: true
      });

    } catch (error) {

      console.error(
        "DELETE MESSAGES ERROR:",
        error
      );

      return res.status(500).json({
        error: error.message
      });

    }

  }
);



app.post(
  "/api/companys",
  async (req, res) => {

    try {

      const {
        user_id,
        company_name,
        business_type,
        description,
        products_services,
        target_customers,
        location,
        goals,
        problems
      } = req.body;


      if (
        !user_id ||
        !company_name ||
        !business_type
      ) {

        return res.status(400).json({
          error:
            "Required company information is missing"
        });

      }


      const [existingCompany] =
        await db.execute(
          `
          SELECT id
          FROM companies
          WHERE user_id = ?
          `,
          [user_id]
        );


      if (existingCompany.length > 0) {

        return res.status(400).json({
          error:
            "This user already has a company"
        });

      }


      const [result] =
        await db.execute(
          `
          INSERT INTO companies
          (
            user_id,
            company_name,
            business_type,
            description,
            products_services,
            target_customers,
            location,
            goals,
            problems
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            user_id,
            company_name,
            business_type,
            description,
            products_services,
            target_customers,
            location,
            goals,
            problems
          ]
        );


      return res.status(201).json({
        success: true,
        company_id:
          result.insertId
      });


    } catch (error) {

      console.error(
        "CREATE COMPANY ERROR:",
        error
      );

      return res.status(500).json({
        error: error.message
      });

    }

  }
);


app.post(
  "/api/sales",
  async (req, res) => {

    try {

      const {
        company_id,
        product_name,
        quantity,
        unit_price,
        sale_date
      } = req.body;


      console.log(
        "SALE BODY:",
        req.body
      );


      if (
        !company_id ||
        !product_name ||
        !quantity ||
        !unit_price ||
        !sale_date
      ) {

        return res.status(400).json({
          error:
            "All sales fields are required"
        });

      }


      const [result] =
        await db.execute(
          `
          INSERT INTO sales
          (
            company_id,
            product_name,
            quantity,
            unit_price,
            sale_date
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            company_id,
            product_name,
            quantity,
            unit_price,
            sale_date
          ]
        );


      console.log(
        "SALE INSERTED:",
        result.insertId
      );


      return res.status(201).json({

        success: true,

        message:
          "Sale added successfully",

        sale_id:
          result.insertId

      });


    } catch (error) {

      console.error(
        "CREATE SALE ERROR:",
        error
      );


      return res.status(500).json({
        error: error.message
      });

    }

  }
);

app.post(
  "/api/marketing",
  async (req, res) => {

    try {

      const {
        company_id,
        campaign_name,
        spend,
        leads,
        conversions,
        revenue,
        start_date,
        end_date
      } = req.body;


      console.log(
        "MARKETING BODY:",
        req.body
      );


      if (
        !company_id ||
        !campaign_name ||
        spend === "" ||
        leads === "" ||
        conversions === "" ||
        revenue === "" ||
        !start_date
      ) {

        return res.status(400).json({
          error:
            "Required marketing fields are missing"
        });

      }


      const [result] =
        await db.execute(
          `
          INSERT INTO marketing_campaigns
          (
            company_id,
            campaign_name,
            spend,
            leads,
            conversions,
            revenue,
            start_date,
            end_date
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            company_id,
            campaign_name,
            spend,
            leads,
            conversions,
            revenue,
            start_date,
            end_date || null
          ]
        );


      console.log(
        "MARKETING CAMPAIGN INSERTED:",
        result.insertId
      );


      return res.status(201).json({

        success: true,

        message:
          "Marketing campaign added successfully",

        campaign_id:
          result.insertId

      });


    } catch (error) {

      console.error(
        "CREATE MARKETING ERROR:",
        error
      );


      return res.status(500).json({
        error: error.message
      });

    }

  }
);

app.post(
  "/api/customers",
  async (req, res) => {

    try {

      const {
        company_id,
        customer_name,
        status,
        sentiment,
        joined_date,
        left_date
      } = req.body;


      console.log(
        "CUSTOMER BODY:",
        req.body
      );


      if (
        !company_id ||
        !customer_name ||
        !status ||
        !sentiment ||
        !joined_date
      ) {

        return res.status(400).json({
          error:
            "Required customer fields are missing"
        });

      }


      const [result] =
        await db.execute(
          `
          INSERT INTO customers
          (
            company_id,
            customer_name,
            status,
            sentiment,
            joined_date,
            left_date
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            company_id,
            customer_name,
            status,
            sentiment,
            joined_date,
            left_date || null
          ]
        );


      console.log(
        "CUSTOMER INSERTED:",
        result.insertId
      );


      return res.status(201).json({

        success: true,

        message:
          "Customer added successfully",

        customer_id:
          result.insertId

      });


    } catch (error) {

      console.error(
        "CREATE CUSTOMER ERROR:",
        error
      );


      return res.status(500).json({
        error: error.message
      });

    }

  }
);

// =====================================
// CHECK BUSINESS SETUP PROGRESS
// =====================================

// =====================================
// CHECK CURRENT SETUP STEP
// =====================================

app.get(
  "/api/setup-progress/:userId/:step",
  async (req, res) => {

    try {

      const userId = req.params.userId;
      const step = req.params.step;

      console.log(
        "CHECKING SETUP FOR USER:",
        userId
      );

      console.log(
        "CURRENT STEP:",
        step
      );


      // =====================================
      // FIND USER COMPANY
      // =====================================

      const [companies] =
        await db.execute(
          `
          SELECT id
          FROM companies
          WHERE user_id = ?
          LIMIT 1
          `,
          [userId]
        );


      // =====================================
      // COMPANY STEP
      // =====================================

      if (step === "company") {

        if (companies.length === 0) {

          return res.json({
            exists: false,
            next: "/company",
            message:
              "Please save your company first."
          });

        }


        const companyId =
          companies[0].id;


        console.log(
          "COMPANY EXISTS:",
          companyId
        );


        return res.json({
          exists: true,
          company_id: companyId,
          next: "/sales"
        });

      }


      // =====================================
      // ALL OTHER STEPS REQUIRE COMPANY
      // =====================================

      if (companies.length === 0) {

        return res.json({
          exists: false,
          next: "/company",
          message:
            "Please create your company first."
        });

      }


      const companyId =
        companies[0].id;


      console.log(
        "COMPANY ID:",
        companyId
      );


      // =====================================
      // SALES STEP
      // =====================================

      if (step === "sales") {

        const [sales] =
          await db.execute(
            `
            SELECT id
            FROM sales
            WHERE company_id = ?
            LIMIT 1
            `,
            [companyId]
          );


        console.log(
          "SALES:",
          sales
        );


        if (sales.length === 0) {

          return res.json({
            exists: false,
            company_id: companyId,
            next: "/sales",
            message:
              "Please add at least one sale first."
          });

        }


        return res.json({
          exists: true,
          company_id: companyId,
          next: "/marketing"
        });

      }


      // =====================================
      // MARKETING STEP
      // =====================================

      if (step === "marketing") {

        const [marketing] =
          await db.execute(
            `
            SELECT id
            FROM marketing_campaigns
            WHERE company_id = ?
            LIMIT 1
            `,
            [companyId]
          );


        console.log(
          "MARKETING:",
          marketing
        );


        if (marketing.length === 0) {

          return res.json({
            exists: false,
            company_id: companyId,
            next: "/marketing",
            message:
              "Please add at least one marketing campaign first."
          });

        }


        return res.json({
          exists: true,
          company_id: companyId,
          next: "/customers"
        });

      }


      // =====================================
      // CUSTOMER STEP
      // =====================================

      if (step === "customers") {

        const [customers] =
          await db.execute(
            `
            SELECT id
            FROM customers
            WHERE company_id = ?
            LIMIT 1
            `,
            [companyId]
          );


        console.log(
          "CUSTOMERS:",
          customers
        );


        if (customers.length === 0) {

          return res.json({
            exists: false,
            company_id: companyId,
            next: "/customers",
            message:
              "Please add at least one customer first."
          });

        }


        return res.json({
          exists: true,
          company_id: companyId,
          next: "/analytics"
        });

      }


      // =====================================
      // INVALID STEP
      // =====================================

      return res.status(400).json({
        error: "Invalid setup step"
      });


    } catch (error) {

      console.error(
        "SETUP PROGRESS ERROR:",
        error
      );


      return res.status(500).json({
        error: error.message
      });

    }

  }
);