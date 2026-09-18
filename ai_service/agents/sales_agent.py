import requests
import json


def run_sales_agent(sales_metrics):

    prompt = f"""
You are the Sales Agent of BizAgent AI.

Your responsibility is to evaluate the sales
performance of a business.

The following metrics were calculated using
Pandas and must be treated as factual data.

SALES METRICS

Total Revenue:
{sales_metrics["total_revenue"]}

Total Orders:
{sales_metrics["total_orders"]}

Revenue Growth:
{sales_metrics["revenue_growth"]}%

Best Product:
{sales_metrics["best_product"]}

Worst Product:
{sales_metrics["worst_product"]}

Monthly Revenue:
{sales_metrics["monthly_revenue"]}

Product Revenue:
{sales_metrics["product_revenue"]}


Based ONLY on these metrics:

1. Evaluate sales performance.
2. Give a score from 0 to 100.
3. Determine the sales status.
4. Identify strengths.
5. Identify problems.
6. Recommend actions.

Return ONLY valid JSON:

{{
    "score": ,
    "status": "",
    "summary": "",
    "strengths": [],
    "problems": [],
    "recommendations": []
}}

Do not invent sales numbers.
"""


    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "llama3.2:3b",

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