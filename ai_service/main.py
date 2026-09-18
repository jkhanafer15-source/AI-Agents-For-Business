from fastapi import FastAPI
from pydantic import BaseModel

import requests
import chromadb

from typing import Optional, List

from graph import business_graph


app = FastAPI()


# =========================================================
# CHROMA DATABASE
# =========================================================

chroma_client = chromadb.PersistentClient(
    path="./vector_db"
)

company_collection = (
    chroma_client.get_or_create_collection(
        name="companies"
    )
)


# =========================================================
# PYDANTIC MODELS
# =========================================================

class CompanyData(BaseModel):
    company_id: int
    company_name: str
    business_type: str
    description: Optional[str] = None
    products_services: Optional[str] = None
    target_customers: Optional[str] = None
    location: Optional[str] = None
    goals: Optional[str] = None
    problems: Optional[str] = None


class ChatRequest(BaseModel):
    company_id: int
    question: str


class Sale(BaseModel):
    product_name: str
    quantity: int
    unit_price: float
    sale_date: str


class Customer(BaseModel):
    customer_name: str
    status: str
    sentiment: str
    joined_date: str
    left_date: Optional[str] = None


class MarketingCampaign(BaseModel):
    campaign_name: str
    spend: float
    leads: int
    conversions: int
    revenue: float
    start_date: str
    end_date: Optional[str] = None


class BusinessAnalysisRequest(BaseModel):
    company_id: int
    sales: List[Sale]
    customers: List[Customer]
    marketing: List[MarketingCampaign]


# =========================================================
# TEST API
# =========================================================

@app.get("/")
def home():

    return {
        "message":
            "BizAgent AI service is working"
    }


# =========================================================
# CREATE EMBEDDING
# =========================================================

def create_embedding(text):

    response = requests.post(
        "http://localhost:11434/api/embed",

        json={
            "model":
                "nomic-embed-text",

            "input":
                text
        }
    )

    data = response.json()

    return data["embeddings"][0]


# =========================================================
# STORE COMPANY IN CHROMA
# =========================================================

@app.post("/company/index")
def index_company(company: CompanyData):

    company_text = f"""
Company Name:
{company.company_name}

Business Type:
{company.business_type}

Description:
{company.description}

Products and Services:
{company.products_services}

Target Customers:
{company.target_customers}

Location:
{company.location}

Business Goals:
{company.goals}

Business Problems:
{company.problems}
"""

    embedding = create_embedding(
        company_text
    )

    company_collection.upsert(

        ids=[
            str(company.company_id)
        ],

        documents=[
            company_text
        ],

        embeddings=[
            embedding
        ],

        metadatas=[
            {
                "company_id":
                    company.company_id,

                "company_name":
                    company.company_name,

                "business_type":
                    company.business_type
            }
        ]
    )

    return {
        "success": True,

        "message":
            "Company added to vector database",

        "company_id":
            company.company_id
    }


# =========================================================
# GET VECTOR DATA
# =========================================================

@app.get("/company/vector-data")
def get_vector_data():

    data = company_collection.get(
        include=[
            "documents",
            "metadatas",
            "embeddings"
        ]
    )

    embeddings = data["embeddings"]

    if embeddings is not None:
        embeddings = embeddings.tolist()

    return {
        "count":
            company_collection.count(),

        "ids":
            data["ids"],

        "documents":
            data["documents"],

        "metadatas":
            data["metadatas"],

        "embeddings":
            embeddings
    }


# =========================================================
# GET ALL VECTORS
# =========================================================

@app.get("/vector/all")
def get_all_vectors():

    data = company_collection.get(
        include=[
            "documents",
            "metadatas",
            "embeddings"
        ]
    )

    embeddings = data["embeddings"]

    if embeddings is not None:
        embeddings = embeddings.tolist()

    return {
        "ids":
            data["ids"],

        "documents":
            data["documents"],

        "metadatas":
            data["metadatas"],

        "embeddings":
            embeddings
    }


# =========================================================
# RAG CHAT
# =========================================================

@app.post("/chat")
def chat(data: ChatRequest):

    company_id = data.company_id
    question = data.question


    # -----------------------------------------
    # 1. Convert question to embedding
    # -----------------------------------------

    question_embedding = create_embedding(
        question
    )


    # -----------------------------------------
    # 2. Search Chroma!!this is the reason of the api
    # -----------------------------------------

    results = company_collection.query(

        query_embeddings=[
            question_embedding
        ],

        where={
            "company_id":
                company_id
        },

        n_results=3
    )


    # -----------------------------------------
    # 3. Get documents
    # -----------------------------------------

    documents = results["documents"][0]


    # -----------------------------------------
    # 4. Create context
    # -----------------------------------------

    context = "\n\n".join(
        documents
    )


    # -----------------------------------------
    # 5. Send context + question to Llama
    # -----------------------------------------

    llama_response = requests.post(
        "http://localhost:11434/api/chat",

        json={
            "model":
                "llama3.2:3b",

            "messages": [

                {
                    "role":
                        "system",

                    "content":
                        """
You are BizAgent AI.

You are an AI business assistant.

Answer the user's question using the
business context provided.

Do not invent business information that
is not available in the context.
"""
                },

                {
                    "role":
                        "user",

                    "content":
                        f"""
BUSINESS CONTEXT:

{context}


USER QUESTION:

{question}
"""
                }

            ],

            "stream":
                False
        }
    )


    # -----------------------------------------
    # 6. Convert Ollama response to JSON
    # -----------------------------------------

    llama_data = (
        llama_response.json()
    )


    # -----------------------------------------
    # 7. Extract answer
    # -----------------------------------------

    answer = (
        llama_data[
            "message"
        ][
            "content"
        ]
    )


    # -----------------------------------------
    # 8. Return answer
    # -----------------------------------------

    return {
        "company_id":
            company_id,

        "answer":
            answer,

        "sources":
            documents
    }


# =========================================================
# BUSINESS ANALYSIS
# =========================================================

@app.post("/business/analyze")
def business_analysis(
    data: BusinessAnalysisRequest
):

    # =====================================================
    # SALES DATA
    # =====================================================

    sales_data = []

    for sale in data.sales:

        sales_data.append({

            "product_name":
                sale.product_name,

            "quantity":
                sale.quantity,

            "unit_price":
                sale.unit_price,

            "sale_date":
                sale.sale_date
        })


    # =====================================================
    # CUSTOMER DATA
    # =====================================================

    customer_data = []

    for customer in data.customers:

        customer_data.append({

            "customer_name":
                customer.customer_name,

            "status":
                customer.status,

            "sentiment":
                customer.sentiment,

            "joined_date":
                customer.joined_date,

            "left_date":
                customer.left_date
        })


    # =====================================================
    # MARKETING DATA
    # =====================================================

    marketing_data = []

    for campaign in data.marketing:

        marketing_data.append({

            "campaign_name":
                campaign.campaign_name,

            "spend":
                campaign.spend,

            "leads":
                campaign.leads,

            "conversions":
                campaign.conversions,

            "revenue":
                campaign.revenue,

            "start_date":
                campaign.start_date,

            "end_date":
                campaign.end_date
        })


    # =====================================================
    # RUN LANGGRAPH
    # =====================================================

    result = business_graph.invoke({

        "company_id":
            data.company_id,

        "sales_data":
            sales_data,

        "customer_data":
            customer_data,

        "marketing_data":
            marketing_data
    })


    # =====================================================
    # CLEAN RESPONSE FOR REACT
    # =====================================================
    #
    # result = complete internal LangGraph state
    #
    # response = clean JSON structure that React needs
    #

    response = {

        "company_id":
            result["company_id"],


        # -----------------------------------------
        # KPI CARDS
        # -----------------------------------------

        "kpis": {

            "total_revenue":
                result[
                    "sales_metrics"
                ][
                    "total_revenue"
                ],

            "total_orders":
                result[
                    "sales_metrics"
                ][
                    "total_orders"
                ],

            "total_customers":
                result[
                    "customer_metrics"
                ][
                    "total_customers"
                ],

            "churn_rate":
                result[
                    "customer_metrics"
                ][
                    "churn_rate"
                ],

            "revenue_growth":
                result["sales_metrics"]
                        ["revenue_growth"]
        },


        # -----------------------------------------
        # CHART DATA
        # -----------------------------------------

        "charts": {

            "monthly_revenue":
                result[
                    "sales_metrics"
                ][
                    "monthly_revenue"
                ],

            "customer_sentiment":
                result[
                    "customer_metrics"
                ][
                    "sentiment"
                ],

            "product_revenue":
                result[
                    "product_metrics"
                ][
                    "product_revenue"
                ]
        },


        # -----------------------------------------
        # INDIVIDUAL AGENT RESULTS
        # -----------------------------------------

        "agents": {

            "sales":
                result[
                    "sales_evaluation"
                ],

            "customer":
                result[
                    "customer_evaluation"
                ],

            "product":
                result[
                    "product_evaluation"
                ],

            "marketing":
                result[
                    "marketing_evaluation"
                ]
        },


        # -----------------------------------------
        # FINAL EVALUATION AGENT
        # -----------------------------------------

        "business_evaluation":
            result[
                "final_evaluation"
            ]
    }


    # =====================================================
    # RETURN TO NODE
    # =====================================================

    return response