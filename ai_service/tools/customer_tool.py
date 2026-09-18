import pandas as pd


def analyze_customers(customer_data):

    df = pd.DataFrame(
        customer_data
    )


    # =========================
    # TOTAL CUSTOMERS
    # =========================

    total_customers = len(df)


    # =========================
    # ACTIVE CUSTOMERS
    # =========================

    active_customers = len(
        df[
            df["status"] == "active"
        ]
    )


    # =========================
    # CHURNED CUSTOMERS
    # =========================

    churned_customers = len(
        df[
            df["status"] == "churned"
        ]
    )


    # =========================
    # CHURN RATE
    # =========================

    if total_customers > 0:

        churn_rate = (
            churned_customers
            /
            total_customers
        ) * 100

    else:

        churn_rate = 0


    # =========================
    # SENTIMENT
    # =========================

    positive = len(
        df[
            df["sentiment"] == "positive"
        ]
    )

    neutral = len(
        df[
            df["sentiment"] == "neutral"
        ]
    )

    negative = len(
        df[
            df["sentiment"] == "negative"
        ]
    )


    # Convert counts to percentages

    if total_customers > 0:

        positive_percentage = (
            positive /
            total_customers
        ) * 100

        neutral_percentage = (
            neutral /
            total_customers
        ) * 100

        negative_percentage = (
            negative /
            total_customers
        ) * 100

    else:

        positive_percentage = 0
        neutral_percentage = 0
        negative_percentage = 0


    # =========================
    # RETURN METRICS
    # =========================

    return {

        "total_customers":
            total_customers,

        "active_customers":
            active_customers,

        "churned_customers":
            churned_customers,

        "churn_rate":
            round(churn_rate, 2),

        "sentiment": {

            "positive":
                round(
                    positive_percentage,
                    2
                ),

            "neutral":
                round(
                    neutral_percentage,
                    2
                ),

            "negative":
                round(
                    negative_percentage,
                    2
                )
        }
    }