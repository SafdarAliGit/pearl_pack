import  frappe


@frappe.whitelist()
def fetch_current_qty(**args):
    conditions = ["sle.item_code = %(item_code)s", "sle.is_cancelled = 0"]

    if "warehouse" in args and args["warehouse"]:
        conditions.append("sle.warehouse = %(warehouse)s")

    query = f"""
        SELECT sle.qty_after_transaction, sle.valuation_rate
        FROM `tabStock Ledger Entry` AS sle
        WHERE {" AND ".join(conditions)}
        ORDER BY sle.posting_date DESC, sle.posting_time DESC
        LIMIT 1
    """

    result = frappe.db.sql(query, args, as_dict=True)

    return result if result else []
