/**
 * WarehouseItem.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "warehouseItems",

  attributes: {
    // 名称
    item_name: {type: 'string', required: true},
    //型号
    item_type: {type: 'string', required: true},
    //描述
    desc: {type: 'string'},
    //单位
    unit: {type: 'string'},
    //库存量
    balance: {type: 'float', required: true},
    init_balance: {type: 'float', required: true},

    constant:{type:'float'},


    warehouseOps: {
      collection: 'warehouseOp',
      via: 'warehouseItem'
    },

    warehouseStockOps: {
      collection: 'warehouseStockOp',
      via: 'warehouseItem'
    },

    supplier: {model: 'supplier', columnName: 'supplier_id', required: true},
    company: {model: 'company', columnName: 'company_id', required: true},
  }
};
