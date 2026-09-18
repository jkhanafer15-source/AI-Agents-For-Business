import pandas as pd


def analyze_sales(sales_data):

    # Convert received sales data
    # into a Pandas DataFrame
    df = pd.DataFrame(sales_data)


    # Convert sale_date into date format
    df["sale_date"] = pd.to_datetime(
        df["sale_date"]
    )


    # Calculate revenue for every sale
    df["revenue"] = (
        df["quantity"] *
        df["unit_price"]
    )


    # -------------------------
    # TOTAL REVENUE
    # -------------------------

    total_revenue = (
        df["revenue"].sum()
    )


    # -------------------------
    # TOTAL ORDERS
    # -------------------------

    total_orders = len(df)


    # -------------------------
    # REVENUE BY PRODUCT
    # -------------------------

    product_revenue = (
        df.groupby("product_name")["revenue"]
        .sum()
    )


    best_product = (
        product_revenue.idxmax()
    )


    worst_product = (
        product_revenue.idxmin()
    )


    # -------------------------
    # MONTHLY REVENUE
    # -------------------------

    df["month"] = (
        df["sale_date"]
        .dt
        .to_period("M")
        .astype(str)
    )


    monthly_revenue = (
        df.groupby("month")["revenue"]
        .sum()
    )


    # -------------------------
    # REVENUE GROWTH
    # -------------------------

    if len(monthly_revenue) >= 2:

        previous_month = (
            monthly_revenue.iloc[-2]
        )

        current_month = (
            monthly_revenue.iloc[-1]
        )


        if previous_month != 0:

            revenue_growth = (
                (
                    current_month -
                    previous_month
                )
                /
                previous_month
            ) * 100

        else:

            revenue_growth = 0

    else:

        revenue_growth = 0


    # -------------------------
    # RETURN RESULT
    # -------------------------

    return {

        "total_revenue":
            float(total_revenue),

        "total_orders":
            int(total_orders),

        "revenue_growth":
            round(
                float(revenue_growth),
                2
            ),

        "best_product":
            best_product,

        "worst_product":
            worst_product,

        "monthly_revenue":
            monthly_revenue.to_dict(),

        "product_revenue":
            product_revenue.to_dict()
    }