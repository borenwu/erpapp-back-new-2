const moment = require('moment')
const CheckService = require('../services/checkService')
const NativeQueryService = require('../services/NativeQueryService')
const ObjectID = require('sails-mongo/node_modules/mongodb').ObjectID;


module.exports = {

  getKmeansModel: function (req, res) {
    let companyId = req.param('company_id')
    let begin = moment().subtract(7, 'months').format('YYYY-MM-DD')
    const today = moment().format('YYYY-MM-DD')


    const aggQuery = [
      {
        $match: {
          "company_id": new ObjectID(companyId),
          "check_time": {"$gte": new Date(begin), "$lte": new Date(today)}
        }
      },
      {
        $group: {
          _id: "$client_id",
          total: {$sum: "$sale"},
          taskCount: {$sum: 1},
          taskDate: {$max: "$task_date"}
        }
      }
    ]

    NativeQueryService.aggregateQuery(Task, aggQuery)
      .then(result => {
        if (result.length === 0) {
          res.ok({status: 201})
        } else {
          // res.ok({status: 200, result: result})
          Client.find({company_id: companyId})
            .then(_clients => {
              if (!_clients) {
                return res.ok({status: 404});
              }
              if (_clients.length === 0) {
                return res.ok({status: 201, msg: 'clients empty'});
              }
              res.ok({status: 200, result: result, clients: _clients})
            })

        }
      })
      .catch(err => {
        console.log(err)
      })


    //get clients crateAt -> L receivable -> Rec

    // CheckService.checkCompanyId(companyId)
    //   .then(_company => {
    //     return Client.find({company_id: _company.id}).populate('company')
    //   })
    //   .then(_clients => {
    //     if (!_clients) {
    //       return res.ok({status: 404});
    //     }
    //     if (_clients.length === 0) {
    //       return res.ok({status: 201, msg: 'clients empty'});
    //     }
    //
    //   })
  }
}
