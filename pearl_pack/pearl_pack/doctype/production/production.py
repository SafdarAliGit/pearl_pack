# Copyright (c) 2025, Safdar Ali and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Production(Document):
    def on_submit(self):
        # STOCK ENTRY SAVING
        doc = frappe.new_doc("Stock Entry")
        doc.stock_entry_type = "Repack"
        doc.purpose = "Repack"
        doc.posting_date = self.date
        doc.production = self.name
        t_warehouse = self.target_warehouse

        # Append target item (final product)
        target_item = doc.append("items", {})
        target_item.set_basic_rate_manually = 1
        target_item.t_warehouse = t_warehouse
        target_item.item_code = self.target_item
        target_item.qty = self.qty
        target_item.valuation_rate = self.target_item_rate
        target_item.basic_rate = self.target_item_rate

        # Append source items (raw materials)
        for item in self.get("source_item"):  # Ensure proper access to child table
            source_item = doc.append("items", {})
            source_item.set_basic_rate_manually = 1
            source_item.s_warehouse = self.source_warehouse  # Correct field for source warehouse
            source_item.item_code = item.source_item  # Correct field name
            source_item.qty = item.qty
            source_item.valuation_rate = item.rate
            source_item.basic_rate = item.rate

        try:
            doc.ignore_validate = True  # Correct flag name
            doc.save()
            doc.submit()
        except Exception as e:
            frappe.throw(_("Error submitting Stock Entry: {0}").format(str(e)))
