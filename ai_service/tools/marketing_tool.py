import pandas as pd


def analyze_marketing(
    marketing_data
):

    df = pd.DataFrame(
        marketing_data
    )


    # Total marketing spend

    total_spend = (
        df["spend"].sum()
    )


    # Total revenue generated
    # from marketing

    total_revenue = (
        df["revenue"].sum()
    )


    # Total leads

    total_leads = (
        df["leads"].sum()
    )


    # Total conversions

    total_conversions = (
        df["conversions"].sum()
    )


    # Conversion rate

    if total_leads > 0:

        conversion_rate = (
            total_conversions
            /
            total_leads
        ) * 100

    else:

        conversion_rate = 0


    # ROI

    if total_spend > 0:

        roi = (
            (
                total_revenue
                -
                total_spend
            )
            /
            total_spend
        ) * 100

    else:

        roi = 0


    # Revenue by campaign

    campaign_revenue = (
        df.groupby(
            "campaign_name"
        )["revenue"]
        .sum()
    )


    # Best campaign

    best_campaign = (
        campaign_revenue.idxmax()
    )


    # Worst campaign

    worst_campaign = (
        campaign_revenue.idxmin()
    )


    return {

        "total_spend":
            float(total_spend),

        "marketing_revenue":
            float(total_revenue),

        "total_leads":
            int(total_leads),

        "total_conversions":
            int(total_conversions),

        "conversion_rate":
            round(
                float(conversion_rate),
                2
            ),

        "roi":
            round(
                float(roi),
                2
            ),

        "best_campaign":
            best_campaign,

        "worst_campaign":
            worst_campaign,

        "campaign_revenue":
            campaign_revenue.to_dict()
    }