/**
 * SalesDashController
 *
 * @description :: Server-side logic for managing Sales Dash
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const CheckService = require('../services/checkService')
const NativeQueryService = require('../services/NativeQueryService')
const moment = require('moment')
const ObjectID = require('sails-mongo/node_modules/mongodb').ObjectID;

module.exports = {

  listTodaySales: function (req, res) {
    let companyId = req.param('company_id')
    let today = moment().format('YYYY-MM-DD')

    Task.find({company_id: companyId, check_time: {'>=': today, '<=': today}}, {saleOpDisable: 0}).populate('client')
      .then(_tasks => {
        if (!_tasks) {
          return res.ok({status: 200, msg: 'no tasks found'});
        }
        if (_tasks.length === 0) {
          return res.ok({status: 201, msg: 'tasks empty'});
        }
        _tasks.map(t => {
          t.client_name = t.client.client_name
          t.client_id = t.client.id
        })
        return res.ok(_tasks);
      })
      .catch(err => res.serverError(err));
  },

  getMonthSoFarSales: function (req, res) {
    let companyId = req.param('company_id')
    const today = moment().format('YYYY-MM-DD')
    let thisMonth = moment().month()
    let thisYear = moment().year()
    const beginOfThisMonth = moment([thisYear, thisMonth]).format('YYYY-MM-DD')

    const aggQuery = [
      {
        $match:{"company_id":new ObjectID(companyId),"check_time":{"$gte":new Date(beginOfThisMonth),"$lte":new Date(today)}}
      },
      {
        $group: {
          _id: "$company_id",
          total: { $sum: "$sale" },
        }
      }
    ]

    NativeQueryService.aggregateQuery(Task, aggQuery)
      .then(result => {
        if(result.length === 0){
          res.ok({status:201})
        }else{
          res.ok({status:200,result:result})
        }
      })
      .catch(err => {
        console.log(err)
      })
  },

  getEachMonthDaySales:function (req,res) {
    let companyId = req.param('company_id')
    const today = moment().format('YYYY-MM-DD')
    let thisMonth = moment().month()
    let thisYear = moment().year()
    const beginOfThisMonth = moment([thisYear, thisMonth]).format('YYYY-MM-DD')

    // const map = function () {
    //   emit(this.check_time,this.sale)
    // }
    //
    // const reduce = function (key,values) {
    //   return Array.sum(values)
    // }
    //
    // const output = {
    //   query:{"company_id":new ObjectID(companyId)},
    //   out:"DailySale"
    // }
    //
    // NativeQueryService.mapReduceQuery(Task,map,reduce,output)
    //   .then(result => {
    //     console.log(result)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })

    const aggQuery = [
      {
        $match:{"company_id":new ObjectID(companyId),"check_time":{"$gte":new Date(beginOfThisMonth),"$lte":new Date(today)}}
      },
      {
        $group: {
          _id: "$check_time",
          total: { $sum: "$sale" },
        }
      }
    ]

    NativeQueryService.aggregateQuery(Task, aggQuery)
      .then(result => {
        if(result.length === 0){
          res.ok({status:201})
        }else{
          res.ok({status:200,result:result})
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

}
