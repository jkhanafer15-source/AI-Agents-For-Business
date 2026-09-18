import requests
import json


def run_customer_agent(
    customer_metrics
):

    prompt = f"""
You are the Customer Agent of BizAgent AI.

Your responsibility is to evaluate customer
performance, retention and sentiment.

The following metrics were calculated using
Pandas.

Treat these values as factual information.

CUSTOMER METRICS:

Total Customers:
{customer_metrics["total_customers"]}

Active Customers:
{customer_metrics["active_customers"]}

Churned Customers:
{customer_metrics["churned_customers"]}

Churn Rate:
{customer_metrics["churn_rate"]}%

Customer Sentiment:
{customer_metrics["sentiment"]}


Based ONLY on these metrics:

1. Evaluate customer performance.
2. Give a score between 0 and 100.
3. Determine the customer status.
4. Identify strengths.
5. Identify problems.
6. Recommend actions.

Return ONLY valid JSON:

{{
    "score": 0,
    "status": "",
    "summary": "",
    "strengths": [],
    "problems": [],
    "recommendations": []
}}

Do not invent customer numbers.
"""


    response = requests.post(
        "http://localhost:11434/api/chat",

        json={
            "model":
                "llama3.2:3b",

            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            "format": "json",

            "stream": False
        }
    )


    data = response.json()


    answer = (
        data["message"]["content"]
    )


    return json.loads(answer)