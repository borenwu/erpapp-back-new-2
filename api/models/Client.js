/**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "clients",

  attributes: {
    client_name: {type: 'string', required: true},
    desc: {type: 'string'},
    receivable: {type: 'float'},


    company: {model: 'company', columnName: 'company_id', required: true},

    tasks: {
      collection: 'task',
      via: 'client'
    },

    accounts:{
      collection:'account',
      via:'client'
    }

  }
};

