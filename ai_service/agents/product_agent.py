import requests
import json


def run_product_agent(
    product_metrics
):

    prompt = f"""
You are the Product Agent of BizAgent AI.

Your responsibility is to evaluate product
performance.

The following metrics were calculated using
Pandas and must be treated as factual.

PRODUCT METRICS:

Total Products:
{product_metrics["total_products"]}

Best Product:
{product_metrics["best_product"]}

Worst Product:
{product_metrics["worst_product"]}

Revenue By Product:
{product_metrics["product_revenue"]}

Units Sold By Product:
{product_metrics["product_units"]}


Based ONLY on these metrics:

1. Evaluate product performance.
2. Give a score from 0 to 100.
3. Determine product performance status.
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

Do not invent product numbers.
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