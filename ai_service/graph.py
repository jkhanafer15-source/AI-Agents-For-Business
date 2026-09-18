from typing import TypedDict

from langgraph.graph import (
    StateGraph,
    START,
    END
)

from tools.sales_tool import (
    analyze_sales
)

from tools.customer_tool import (
    analyze_customers
)

from tools.product_tool import (
    analyze_products
)

from tools.marketing_tool import (
    analyze_marketing
)

from agents.sales_agent import (
    run_sales_agent
)

from agents.customer_agent import (
    run_customer_agent
)

from agents.product_agent import (
    run_product_agent
)

from agents.marketing_agent import (
    run_marketing_agent
)

from agents.evaluation_agent import (
    run_evaluation_agent
)


# =========================================================
# LANGGRAPH STATE
# =========================================================

class BusinessState(
    TypedDict,
    total=False
):

    company_id: int

    # Input data
    sales_data: list
    customer_data: list
    marketing_data: list

    # Sales agent
    sales_metrics: dict
    sales_evaluation: dict

    # Customer agent
    customer_metrics: dict
    customer_evaluation: dict

    # Product agent
    product_metrics: dict
    product_evaluation: dict

    # Marketing agent
    marketing_metrics: dict
    marketing_evaluation: dict

    # Final evaluation
    final_evaluation: dict


# =========================================================
# SALES NODE
# =========================================================

def sales_node(
    state: BusinessState
):

    # Pandas tool calculates facts
    sales_metrics = analyze_sales(
        state["sales_data"]
    )

    # LLM agent evaluates those facts
    sales_evaluation = run_sales_agent(
        sales_metrics
    )

    # LangGraph merges these values
    # into the shared state
    return {
        "sales_metrics":
            sales_metrics,

        "sales_evaluation":
            sales_evaluation
    }


# =========================================================
# CUSTOMER NODE
# =========================================================

def customer_node(
    state: BusinessState
):

    customer_metrics = analyze_customers(
        state["customer_data"]
    )

    customer_evaluation = (
        run_customer_agent(
            customer_metrics
        )
    )

    return {
        "customer_metrics":
            customer_metrics,

        "customer_evaluation":
            customer_evaluation
    }


# =========================================================
# PRODUCT NODE
# =========================================================

def product_node(
    state: BusinessState
):

    # Product analysis uses sales data
    product_metrics = analyze_products(
        state["sales_data"]
    )

    product_evaluation = (
        run_product_agent(
            product_metrics
        )
    )

    return {
        "product_metrics":
            product_metrics,

        "product_evaluation":
            product_evaluation
    }


# =========================================================
# MARKETING NODE
# =========================================================

def marketing_node(
    state: BusinessState
):

    marketing_metrics = (
        analyze_marketing(
            state["marketing_data"]
        )
    )

    marketing_evaluation = (
        run_marketing_agent(
            marketing_metrics
        )
    )

    return {
        "marketing_metrics":
            marketing_metrics,

        "marketing_evaluation":
            marketing_evaluation
    }


# =========================================================
# FINAL EVALUATION NODE
# =========================================================

def evaluation_node(
    state: BusinessState
):

    final_evaluation = (
        run_evaluation_agent(

            state[
                "sales_evaluation"
            ],

            state[
                "customer_evaluation"
            ],

            state[
                "product_evaluation"
            ],

            state[
                "marketing_evaluation"
            ]
        )
    )

    return {
        "final_evaluation":
            final_evaluation
    }


# =========================================================
# CREATE GRAPH
# =========================================================

builder = StateGraph(
    BusinessState
)


# =========================================================
# ADD NODES
# =========================================================

builder.add_node(
    "sales_agent",
    sales_node
)

builder.add_node(
    "customer_agent",
    customer_node
)

builder.add_node(
    "product_agent",
    product_node
)

builder.add_node(
    "marketing_agent",
    marketing_node
)

builder.add_node(
    "evaluation_agent",
    evaluation_node
)


# =========================================================
# ADD EDGES
# =========================================================

builder.add_edge(
    START,
    "sales_agent"
)

builder.add_edge(
    "sales_agent",
    "customer_agent"
)

builder.add_edge(
    "customer_agent",
    "product_agent"
)

builder.add_edge(
    "product_agent",
    "marketing_agent"
)

builder.add_edge(
    "marketing_agent",
    "evaluation_agent"
)

builder.add_edge(
    "evaluation_agent",
    END
)


# =========================================================
# COMPILE GRAPH
# =========================================================

business_graph = builder.compile() 