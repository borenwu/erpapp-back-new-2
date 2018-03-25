/**
 * Suplier.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "suppliers",
  attributes: {
    supplier_name: {type: 'string', required: true},
    desc: {type: 'string'},
    payable: {type: 'float'},


    company: {model: 'company', columnName: 'company_id', required: true},

    warehouseItems: {
      collection: 'warehouseItem',
      via: 'supplier'
    },

    accounts:{
      collection:'account',
      via:'supplier'
    }
  }
};

