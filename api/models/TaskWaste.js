/**
 * WarehouseOp.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "taskWastes",

  attributes: {
    op_date: {type: 'date', required: true},
    waste_name:{type:'string',required:true},
    unit:{type:'string',required:true},
    amount:{type:'float',required:true},
    maker:{type:'string'},
    make_time:{type:'datetime'},
    checker:{type:'string'},
    check_time:{type:'datetime'},

    company: {model: 'company', columnName: 'company_id', required: true},
  }
};
