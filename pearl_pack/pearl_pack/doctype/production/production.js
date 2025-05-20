// Copyright (c) 2025, Safdar Ali and contributors
// For license information, please see license.txt

frappe.ui.form.on('Production', {
	
		refresh: function(frm) {
        frm.set_query('target_item', function() {
            return {
                filters: {
                    item_group: 'Finish Item' 
                }
            };
        });
		frm.set_query('source_item','source_item', function() {
            return {
                filters: {
                    item_group: 'Raw Material' 
                }
            };
        });
    },
	qty:function(frm){
		calculate_kg_meter(frm);
	},
	
});

frappe.ui.form.on('Source Item', {
	source_item:function(frm,cdt,cdn){
		let row = locals[cdt][cdn];
		// if(row.uom == 'Nos') {
		// 	frappe.model.set_value(cdt,cdn,'qty_in_kgs',0);
		// 	frappe.model.set_value(cdt,cdn,'qty_in_meters',0);
		// }else{
		// 	frappe.model.set_value(cdt,cdn,'qty_in_kgs',frm.doc.qty);
		// 	frappe.model.set_value(cdt,cdn,'qty_in_meters',frm.doc.qty);
		// }	
		

		frappe.call({
			method: 'pearl_pack.pearl_pack.events.fetch_current_qty.fetch_current_qty',
			args: {
				item_code: row.source_item,
				warehouse: frm.doc.source_warehouse
			},
			callback: function(r) {
				if (r.message && r.message.length > 0) {
					frappe.model.set_value(cdt, cdn, 'available_qty', r.message[0].qty_after_transaction || 0);
					frappe.model.set_value(cdt, cdn, 'rate', r.message[0].valuation_rate || 0);
					// if(row.uom == 'Nos') {
					// 	frappe.model.set_value(cdt,cdn,'amount',flt(r.message[0].qty_after_transaction || 0) * flt(row.rate));
					// }else{
					// 	frappe.model.set_value(cdt,cdn,'amount',flt(row.qty_in_kgs) * flt(row.rate));
					// }
					

				} else {
					frappe.model.set_value(cdt, cdn, 'available_qty', 0);
					frappe.model.set_value(cdt, cdn, 'rate', 0);
				}
				// calculate_total_amount(frm,cdt,cdn);
			}
		});
		

	},
	qty:function(frm,cdt,cdn){
		let row = locals[cdt][cdn];
		frappe.model.set_value(cdt,cdn,'amount',flt(row.qty) * flt(row.rate));
		calculate_total_amount(frm,cdt,cdn);
	},
	rate:function(frm,cdt,cdn){
		let row = locals[cdt][cdn];
		frappe.model.set_value(cdt,cdn,'amount',flt(row.qty) * flt(row.rate));
		calculate_total_amount(frm,cdt,cdn);
	}
});

function calculate_kg_meter(frm) {
	let kg = 0;
	let meter = 0;
	let item_kg = frm.doc.item_kg;
	let item_meter = frm.doc.item_meter;
	let qty = frm.doc.qty;
	meter = qty * item_meter;
	kg = qty * item_kg;	
	frm.set_value('kg', kg);
	frm.set_value('meter', meter);
}

function calculate_total_amount(frm,cdt,cdn){
	let row = locals[cdt][cdn];
	let total_amount = 0;
	if (frm.doc.source_item && frm.doc.source_item.length > 0) {
		frm.doc.source_item.forEach(item => {
			total_amount += item.amount || 0;  
		});
	}
	frm.set_value('saource_item_amount', total_amount);
	if(total_amount > 0){
		let target_item_rate = total_amount / frm.doc.qty;
		frm.set_value('target_item_rate', target_item_rate);
	}
	
}