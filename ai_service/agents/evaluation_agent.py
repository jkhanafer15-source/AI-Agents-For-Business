import requests
import json


def run_evaluation_agent(
    sales_evaluation,
    customer_evaluation,
    product_evaluation,
    marketing_evaluation
):

    prompt = f"""
You are the Evaluation Agent of BizAgent AI.

Your responsibility is to evaluate the overall
performance of the business.

Four specialized AI agents have already analyzed
different areas of the business.

SALES EVALUATION:
{json.dumps(sales_evaluation)}

CUSTOMER EVALUATION:
{json.dumps(customer_evaluation)}

PRODUCT EVALUATION:
{json.dumps(product_evaluation)}

MARKETING EVALUATION:
{json.dumps(marketing_evaluation)}

Using these four evaluations:

1. Give the overall business a score from 0 to 100.
2. Determine the overall business status.
3. Write a short overall summary.
4. Identify the most important business strengths.
5. Identify the most important business problems.
6. Recommend the most important actions.

Return ONLY valid JSON:

{{
    "overall_score": 0,
    "overall_status": "",
    "summary": "",
    "strengths": [],
    "problems": [],
    "recommendations": []
}}

Do not invent business numbers.
Base your evaluation only on the information
provided by the specialized agents.
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