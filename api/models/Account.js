/**
 * Account.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: "accounts",

    attributes: {
        op_date: {type: 'date'},
        op_name: {type: 'string', required: true},
        direction: {type: 'string', enum: ['借', '贷']},
        amount: {type: 'float'},
        maker: {type: 'string'},
        invoice:{type:'string'},

        client: {model: 'client', columnName: 'client_id'},
        supplier: {model: 'supplier', columnName: 'supplier_id'},
    }
};

