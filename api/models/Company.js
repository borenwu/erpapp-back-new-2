module.exports = {

  tableName: "company",

  attributes: {
    company_name: {type: 'string', required: true},
    secret: {type: 'string', required: true},

    users: {
      collection: 'user',
      via: 'company'
    },

    clients:{
      collection:'client',
      via:'company'
    },

    tasks:{
      collection:'task',
      via:'company'
    },

    suppliers:{
      collection:'supplier',
      via:'company'
    },

    warehouseItems:{
      collection:'warehouseItem',
      via:'company'
    },

    warehouseOps:{
      collection:'warehouseOp',
      via:'company'
    },

    warehouseStockOps:{
      collection:'warehouseStockOp',
      via:'company'
    }
  }
};
