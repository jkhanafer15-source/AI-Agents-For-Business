import requests
import json


def run_marketing_agent(
    marketing_metrics
):

    prompt = f"""
You are the Marketing Agent of BizAgent AI.

Your responsibility is to evaluate
the marketing performance of a business.

The following metrics were calculated
using Pandas.

Treat these values as factual information.

MARKETING METRICS:

Total Marketing Spend:
{marketing_metrics["total_spend"]}

Marketing Revenue:
{marketing_metrics["marketing_revenue"]}

Total Leads:
{marketing_metrics["total_leads"]}

Total Conversions:
{marketing_metrics["total_conversions"]}

Conversion Rate:
{marketing_metrics["conversion_rate"]}%

Marketing ROI:
{marketing_metrics["roi"]}%

Best Campaign:
{marketing_metrics["best_campaign"]}

Worst Campaign:
{marketing_metrics["worst_campaign"]}

Campaign Revenue:
{marketing_metrics["campaign_revenue"]}


Based ONLY on these metrics:

1. Evaluate marketing performance.
2. Give a score from 0 to 100.
3. Determine marketing status.
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

Do not invent marketing numbers.
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