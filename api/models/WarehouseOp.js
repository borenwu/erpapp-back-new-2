/**
 * WarehouseOp.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "warehouseOps",

  attributes: {
    op_date: {type: 'date', required: true},
    supplier_name:{type:'string',required:true},
    item_name:{type:'string',required:true},
    item_type:{type:'string',required:true},
    unit:{type:'string',required:true},
    order:{type:'float',required:true},
    re:{type:'float',required:true},
    use:{type:'float',required:true},
    waste:{type:'float'},
    reason:{type:'string'},
    status:{type:'boolean'},
    maker:{type:'string'},
    make_time:{type:'datetime'},
    checker:{type:'string'},
    check_time:{type:'datetime'},

    warehouseItem: {model: 'warehouseItem', columnName: 'warehouseItem_id', required: true},
    company: {model: 'company', columnName: 'company_id', required: true},
  }
};
