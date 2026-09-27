# AI Agents for Business — BizAgent AI

BizAgent AI is a full-stack AI-powered business intelligence platform designed to help businesses analyze their sales, customers, products, and marketing performance using specialized AI agents.

Instead of relying on a single general-purpose chatbot, the system combines structured business data, deterministic analytics, retrieval-augmented generation (RAG), and multiple specialized AI agents orchestrated with LangGraph.

The goal is to transform raw business data into understandable insights and actionable recommendations.

---

## Problem

Businesses collect large amounts of data about:

- Sales
- Customers
- Products
- Marketing campaigns
- Revenue
- Business performance

However, raw data alone does not explain:

- Why revenue is increasing or decreasing
- Which products perform best
- Why customers are leaving
- Whether marketing campaigns are profitable
- What actions the business should take next

BizAgent AI addresses this problem by combining traditional data analysis with AI reasoning.

---

## Solution

The platform follows this general architecture:

```text
Business User
     ↓
React Frontend
     ↓
Node.js / Express API
     ↓
MySQL Database
     ↓
FastAPI AI Service
     ↓
LangGraph
     ↓
Specialized AI Agents
     ↓
Business Analysis & Recommendations
```

Each specialized agent focuses on a different part of the business.

```text
                    Business Data
                         ↓
                     LangGraph
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Sales Agent     Customer Agent    Product Agent
        ↓                ↓                ↓
 Sales Analysis    Customer Analysis Product Analysis

                         ↓
                  Marketing Agent
                         ↓
                 Marketing Analysis

                         ↓
                Final Evaluation
                         ↓
              Business Recommendations
```

---

## AI Agent Architecture

The system uses multiple specialized agents rather than asking one LLM to analyze everything at once.

### Sales Agent

Analyzes sales performance such as:

- Total revenue
- Number of orders
- Best-performing products
- Worst-performing products
- Monthly revenue
- Revenue growth

### Customer Agent

Analyzes customer behavior such as:

- Total customers
- Active customers
- Churned customers
- Churn rate
- Customer sentiment

### Product Agent

Analyzes product performance including:

- Product revenue
- Units sold
- Best-performing products
- Worst-performing products

### Marketing Agent

Analyzes marketing campaign performance including:

- Marketing spend
- Campaign revenue
- Leads
- Conversions
- Conversion rate
- Return on investment (ROI)

### Final Business Evaluation

The results produced by the specialized agents are combined to create a broader evaluation of the business.

---

## LangGraph Orchestration

LangGraph manages the execution flow between the specialized agents.

A shared state is passed through the graph:

```text
Initial Business Data
        ↓
Sales Agent
        ↓
Customer Agent
        ↓
Product Agent
        ↓
Marketing Agent
        ↓
Final Evaluation
        ↓
Final Graph State
```

Each node receives the current state, performs its task, and returns new information that is merged into the shared state.

Example:

```python
{
    "company_id": 8,
    "sales_data": [...],
    "customer_data": [...],
    "marketing_data": [...],
    "sales_metrics": {...},
    "sales_evaluation": {...},
    "customer_metrics": {...},
    "marketing_metrics": {...},
    "final_evaluation": {...}
}
```

This architecture makes the AI workflow modular and easier to extend with additional agents.

---

## Deterministic Analytics + AI Reasoning

BizAgent AI separates numerical calculations from LLM reasoning.

```text
Business Data
     ↓
Pandas Analytics
     ↓
Calculated KPIs
     ↓
AI Agent
     ↓
Interpretation
     ↓
Recommendations
```

Pandas is responsible for deterministic calculations such as revenue, churn rate, conversion rate, and ROI.

The LLM receives these calculated metrics and focuses on:

- Interpretation
- Pattern recognition
- Business reasoning
- Recommendations

This prevents the language model from being responsible for calculations that can be performed reliably with normal code.

---

## RAG and Vector Database

The project also uses Retrieval-Augmented Generation (RAG).

Business information can be converted into embeddings and stored in ChromaDB.

```text
Business Information
        ↓
Text Documents
        ↓
nomic-embed-text
        ↓
Embedding Vectors
        ↓
ChromaDB
```

When relevant context is needed:

```text
User Question
      ↓
Question Embedding
      ↓
ChromaDB Similarity Search
      ↓
Relevant Context
      ↓
LLM
      ↓
Context-Aware Answer
```

This allows the AI to reason using retrieved business knowledge instead of depending only on the LLM's general knowledge.

---

## Business Knowledge Dataset

The project is being extended with an external business knowledge dataset for the vector database.

Dataset:

**E-Commerce Customer Behavior & Sales Analysis**

Relevant information includes:

- Orders
- Customers
- Product categories
- Prices
- Quantities
- Discounts
- Customer behavior
- Session activity
- Delivery performance
- Customer ratings

Rather than embedding raw CSV values directly, structured records are transformed into meaningful business documents before embeddings are generated.

Example:

```text
A returning customer purchased products from the Electronics category.
A discount was applied to the purchase.
The customer spent time browsing multiple product pages.
Delivery took several days and the customer provided a positive rating.
```

The documents are then embedded and stored in ChromaDB for semantic retrieval.

---

## Full System Architecture

```text
                         USER
                           │
                           ▼
                    React Frontend
                           │
                           ▼
                  Node.js + Express
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
           MySQL                     FastAPI
              │                         │
              │                         ▼
              │                     LangGraph
              │                         │
              │              ┌──────────┼──────────┐
              │              ▼          ▼          ▼
              │           Sales      Customer    Product
              │           Agent       Agent       Agent
              │                                      │
              │                         Marketing Agent
              │                                │
              │                                ▼
              │                       Final Evaluation
              │
              │                         ChromaDB
              │                            ▲
              │                            │
              │                    nomic-embed-text
              │
              └──────── Business Data ──────────────┘

                           │
                           ▼
                       Ollama LLM
                    llama3.2:3b
                           │
                           ▼
               Insights & Recommendations
```

---

##  Technology Stack

### Frontend

- React
- JavaScript
- HTML
- CSS
- Fetch API
- React Router

### Backend

- Node.js
- Express.js
- REST APIs
- MySQL

### AI Service

- Python
- FastAPI
- Pandas
- LangGraph

### AI / LLM

- Ollama
- Llama 3.2 3B
- nomic-embed-text

### Vector Database

- ChromaDB

### Database

- MySQL

---

## Database Structure

The main relationship between users and business data is:

```text
users
  │
  │ id
  ▼
companies
  │
  │ company_id
  ├──────────────┐
  │              │
  ▼              ▼
sales        customers
  │
  ▼
marketing_campaigns
```

Each company owns its business data, allowing the AI analysis to operate on the correct company's information.

---

## User and Company Flow

```text
Register
   ↓
Login
   ↓
Create Company
   ↓
Add Sales
   ↓
Add Marketing Campaigns
   ↓
Add Customers
   ↓
Analytics
   ↓
AI Business Analysis
```

The logged-in user's ID is connected to a company through MySQL.

The company ID is then used throughout the application to retrieve the correct sales, customer, marketing, and AI analysis data.

---

## API Architecture

The application uses multiple service layers:

```text
React
  │
  │ HTTP Request
  ▼
Node.js REST API
  │
  ├── MySQL
  │
  └── FastAPI
        │
        ├── LangGraph
        ├── Pandas Tools
        ├── ChromaDB
        └── Ollama
```

Node.js handles the main application backend and database communication.

FastAPI acts as the AI service responsible for machine learning and agent-related functionality.

---

## Project Structure

```text
agents/
│
├── client/
│   └── React frontend
│
├── server/
│   └── Node.js / Express backend
│
├── ai_service/
│   ├── FastAPI
│   ├── LangGraph
│   ├── AI agents
│   ├── analytics tools
│   └── vector database logic
│
└── dataset/
    └── Business datasets
```

The exact structure may continue to evolve as the project develops.

---

## Running the Project Locally

### 1. Start MySQL

Make sure the MySQL server is running and the BizAgent database has been created.

### 2. Start Ollama

Make sure Ollama is installed and running.

Required models include:

```bash
ollama pull llama3.2:3b
ollama pull nomic-embed-text
```

### 3. Start the FastAPI AI Service

```bash
cd ai_service

python3 -m uvicorn main:app --reload --port 8000
```

FastAPI:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

### 4. Start the Node.js Backend

```bash
cd server

npm install
node server.js
```

Backend:

```text
http://localhost:5050
```

### 5. Start the React Frontend

```bash
cd client

npm install
npm start
```

---

## Key Engineering Concepts Demonstrated

This project demonstrates practical experience with:

- Full-stack web development
- REST API design
- React frontend development
- Node.js backend development
- Relational database design
- FastAPI microservices
- Data analysis with Pandas
- Large Language Models
- AI agents
- Multi-agent systems
- LangGraph orchestration
- Shared agent state
- Tool-using AI agents
- Embeddings
- Vector databases
- Semantic search
- Retrieval-Augmented Generation (RAG)
- Business intelligence
- AI-assisted decision support

---

## Future Improvements

Planned improvements include:

- Expand the business knowledge vector database
- Improve RAG retrieval
- Add more specialized agents
- Improve business recommendations
- Add richer analytics dashboards
- Improve agent evaluation
- Add additional business datasets
- Improve authentication and security
- Deploy the complete platform
- Add automated testing and monitoring

---

## Project Goal

The main goal of BizAgent AI is not simply to build another AI chatbot.

The project explores how a real full-stack application can combine:

```text
Structured Business Data
        +
Deterministic Analytics
        +
Vector Retrieval
        +
Large Language Models
        +
Specialized AI Agents
        +
LangGraph Orchestration
        ↓
AI-Powered Business Intelligence
```

This architecture allows each technology to handle the task it is best suited for while keeping the overall system modular and extensible.

---

## Author

**Jawad Khanafer**

Computer Science Graduate  
Full-Stack Developer | AI / ML Engineering

This project is being developed as a portfolio project demonstrating the integration of full-stack software engineering, data analysis, RAG, and agentic AI systems.
