/**
 * TaskWasteController
 *
 * @description :: Server-side logic for managing Supliers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


const CheckService = require('../services/checkService')
const moment = require('moment')

module.exports = {

  createTaskWaste: function (req, res) {
    let companyId = req.param('company_id')
    let waste_name = req.param('waste_name')
    let unit = req.param('unit')
    let amount = req.param('amount')
    let maker = req.param('maker')


    CheckService.checkCompanyId(companyId)
      .then(company => {
        return TaskWaste.create({
          op_date: moment().format('YYYY-MM-DD'),
          waste_name: waste_name,
          unit: unit,
          amount:amount,
          maker:maker,
          make_time: moment().format('YYYY-MM-DD'),
          company: companyId
        })
      })
      .then(taskWaste => {
        if (!taskWaste) throw new Error('Unable to create new task waste item')
        return res.ok(taskWaste)
      })
      .catch(err => res.serverError(err.message));
  },

  deleteTaskWaste: function (req, res) {
    let companyId = req.param('company_id')
    let taskWasteId = req.param('waste_id')

    CheckService.checkCompanyId(companyId)
      .then(company => {
        return TaskWaste.destroy({id: taskWasteId, company_id: companyId})
      })
      .then(taskWaste => {
        if (!taskWaste || taskWaste.length === 0) return res.notFound({err: 'No task waste found in our record'});
        return res.ok({status: 200, msg: 'delete ok'});
      })
  },

  deleteTaskWasteById: function (req, res) {
    let taskWasteId = req.params.id

    TaskWaste.destroy({id: taskWasteId})
      .then(taskWaste => {
        if (!taskWaste || taskWaste.length === 0) return res.notFound({err: 'No task waste found in our record'});
        return res.ok({status: 200, msg: 'delete ok'});
      })
  },


  updateTaskWaste: function (req, res) {
    let companyId = req.param('company_id')
    let taskWasteId = req.param('waste_id')
    let amount = req.param('amount')
    let maker = req.param('maker')
    let make_time = moment().format('YYYY-MM-DD')


    let taskWaste = {};
    taskWaste.amount = amount
    taskWaste.maker = maker
    taskWaste.make_time = make_time

    CheckService.checkCompanyId(companyId)
      .then(company => {
        return TaskWaste.update({id: taskWasteId, company_id: companyId}, taskWaste)
      })
      .then(taskWaste => {
        if (!taskWaste[0] || taskWaste[0].length === 0) return res.notFound({err: 'No warehouse item op found in our record'});
        res.ok(taskWaste[0])
      })
      .catch(err => res.serverError(err))
  },

  listTaskWastesByCompany: function (req, res) {
    let companyId = req.param('company_id')
    let startDate = req.param('start_date')
    let endDate = req.param('end_date')

    TaskWaste.find({company_id: companyId, op_date: {'>=': startDate, '<=': endDate}})
      .then(taskWastes => {
        if (!taskWastes) {
          return res.ok({status: 404, msg: 'no task waste found'});
        }
        if (taskWastes.length === 0) {
          return res.ok({status: 201, msg: 'ops empty'});
        }
        return res.ok(taskWastes);
      })
      .catch(err => res.serverError(err));
  },

}
