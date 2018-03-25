/**
 * Task.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "tasks",

  attributes: {
    task_date: {type: 'date', required: true},
	  due_date:{type:'date',required:true},
    task_name: {type: 'string', required: true},
    desc: {type: 'string'},
    volume: {type: 'float', required: true},
    status:{type:'boolean'},
    price: {type: 'float', required: true},
    sale: {type: 'float', required: true},
    maker:{type:'string'},
    make_time:{type:'datetime'},
    checker:{type:'string'},
    check_time:{type:'datetime'},
    saleOpDisable:{type:'boolean'},

    daily: {
      type: 'array'
    },

    client: {model: 'client', columnName: 'client_id', required: true},
    company: {model: 'company', columnName: 'company_id', required: true},
  }
};

