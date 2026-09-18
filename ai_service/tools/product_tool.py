import pandas as pd


def analyze_products(sales_data):

    df = pd.DataFrame(sales_data)

    # Revenue for every sales row
    df["revenue"] = (
        df["quantity"] *
        df["unit_price"]
    )


    # Revenue by product
    product_revenue = (
        df.groupby("product_name")["revenue"]
        .sum()
    )


    # Units sold by product
    product_units = (
        df.groupby("product_name")["quantity"]
        .sum()
    )


    best_product = (
        product_revenue.idxmax()
    )


    worst_product = (
        product_revenue.idxmin()
    )


    total_products = (
        df["product_name"]
        .nunique()
    )


    return {

        "total_products":
            int(total_products),

        "best_product":
            best_product,

        "worst_product":
            worst_product,

        "product_revenue":
            product_revenue.to_dict(),

        "product_units":
            product_units.to_dict()
    }