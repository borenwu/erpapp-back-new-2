/**
 * WarehouseStockOp.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: "warehouseStockOps",

    attributes: {
        op_date: {type: 'date', required: true},
        supplier_name: {type: 'string', required: true},
        item_name: {type: 'string', required: true},
        item_type: {type: 'string', required: true},
        unit: {type: 'string', required: true},
        amount: {type: 'float', required: true},
        new_balance:{type:'float',required:true},
        maker: {type: 'string'},


        warehouseItem: {model: 'warehouseItem', columnName: 'warehouseItem_id', required: true},
        company: {model: 'company', columnName: 'company_id', required: true},
    }
};
