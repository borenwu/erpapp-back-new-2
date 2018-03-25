/**
 * TaskController
 *
 * @description :: Server-side logic for managing Tasks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const CheckService = require('../services/checkService')
const AccountService = require('../services/AccountService')
const moment = require('moment')

module.exports = {

    create: function (req, res) {
        let companyId = req.param('company_id')
        let clientName = req.param('client_name')
        let taskDate = req.param('task_date')
        let dueDate = req.param('due_date')
        let taskName = req.param('task_name')
        let desc = req.param('desc') || ''
        let volume = Number(req.param('volume')) || 0.0
        let price = Number(req.param('price')) || 0.0
        let sale = Number(req.param('sale')) || 0.0
        let maker = req.param('maker')
        let make_time = req.param('make_time')


        if (!companyId) {
            return res.badRequest({err: 'Invlaid companyId'});
        }

        CheckService.checkClientName(companyId, clientName)
            .then(_client => {
                return Task.create({
                    task_date: taskDate,
                    due_date: dueDate,
                    task_name: taskName,
                    desc: desc,
                    volume: volume,
                    status: false,
                    price: price,
                    sale: sale,
                    client: _client.id,
                    company: companyId,
                    maker: maker,
                    make_time: make_time,
                    saleOpDisable: false,
                });
            })
            .then(_task => {
                if (!_task) throw new Error('Unable to create new client')
                _task.client_name = clientName
                return res.ok(_task)
            })
            .catch(err => res.serverError(err.message));
    },

    delete: function (req, res) {
        let companyId = req.param('company_id')
        let clientName = req.param('client_name')
        let taskId = req.param('task_id')

        CheckService.checkClientName(companyId, clientName)
            .then(_client => {
                return Task.destroy({id: taskId, client_id: _client.id})
            })
            .then(_task => {
                if (!_task || _task.length === 0) return res.notFound({err: 'No task found in our record'});
                return res.ok({status: 200, msg: 'delete ok'});
            })
    },

    deleteTaskById: function (req, res) {
        let taskId = req.params.id

        Task.destroy({id: taskId})
            .then(_task => {
                if (!_task || _task.length === 0) return res.notFound({err: 'No task found in our record'});
                return res.ok({status: 200, msg: 'delete ok'});
            })
    },

    update: function (req, res) {
        let taskId = req.param('task_id')
        let companyId = req.param('company_id')
        let clientName = req.param('client_name')
        let dueDate = req.param('due_date')
        let taskName = req.param('task_name')
        let desc = req.param('desc')
        let volume = Number(req.param('volume'))
        let maker = req.param('maker')
        let make_time = moment().format('YYYY-MM-DD')

        if (!taskId) return res.badRequest({err: 'task id is missing'});

        let task = {};

        if (taskName) {
            task.task_name = taskName
        }
        if (dueDate) {
            task.due_date = dueDate
        }
        if (desc) {
            task.desc = desc
        }
        if (volume) {
            task.volume = volume
        }
        if (maker) {
            task.maker = maker
        }
        if (make_time) {
            task.make_time = make_time
        }

        CheckService.checkClientName(companyId, clientName)
            .then(_client => {
                return Task.update({id: taskId, client_id: _client.id}, task)
            })
            .then(_task => {
                if (!_task[0] || _task[0].length === 0) return res.notFound({err: 'No task found in our record'});
                Task.findOne({id: _task[0].id}).populate('client')
                    .then((task, err) => {
                        if (err) {
                            return res.serverError(err);
                        }
                        task.client_name = task.client.client_name
                        task.client_id = task.client.id
                        return res.ok(task);
                    })
            })
            .catch(err => res.serverError(err))
    },

    listAllTasksByCompany: function (req, res) {
        // console.log('listAllTasksByCompany')
        let companyId = req.param('company_id')
        let startDate = req.param('start_date')
        let endDate = req.param('end_date')

        Task.find({company_id: companyId, task_date: {'>=': startDate, '<=': endDate}}).populate('client')
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

    listAllTasksByClient: function (req, res) {
        let companyId = req.param('company_id')
        let clientName = req.param('client_name')
        let startDate = req.param('start_date')
        let endDate = req.param('end_date')

        CheckService.checkClientName(companyId, clientName)
            .then(_client => {
                return Task.find({
                    client_id: _client.id,
                    task_date: {'>=': startDate, '<=': endDate}
                }).populate('client')
            })
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

    listAllTasksByClientDue: function (req, res) {
        let companyId = req.param('company_id')
        let clientName = req.param('client_name')
        let startDate = req.param('start_date')
        let endDate = req.param('end_date')

        CheckService.checkClientName(companyId, clientName)
            .then(_client => {
                return Task.find({client_id: _client.id, due_date: {'>=': startDate, '<=': endDate}})
            })
            .then(_tasks => {
                if (!_tasks || _tasks.length === 0) {
                    throw new Error('No task found');
                }
                return res.ok(_tasks);
            })
            .catch(err => res.serverError(err));
    },

    ////////////////////////////////////////////////////////////////////////////////

    updateSale: function (req, res) {
        let companyId = req.param('company_id')
        let clientName = req.param('client_name')
        let taskId = req.param('task_id')
        let price = req.param('price')
        let sale = req.param('sale')
        let checker = req.param('checker')
        let check_time = moment().format('YYYY-MM-DD')

        let task = {}

        task.price = price
        task.sale = sale
        task.checker = checker
        task.check_time = check_time
        task.saleOpDisable = true

        CheckService.checkClientName(companyId, clientName)
            .then(_client => {
                return Task.update({id: taskId, client_id: _client.id}, task)
            })
            .then(_task => {


                if (!_task[0] || _task[0].length === 0) return res.notFound({err: 'No task found in our record'});
                Task.findOne({id: _task[0].id}).populate('client')
                    .then((task, err) => {
                        if (err) {
                            return res.serverError(err);
                        }

                        task.client_name = task.client.client_name
                        task.client_id = task.client.id

                        let op_name = '销售入账'
                        AccountService.accountReceivableDr(task.company, task.client_name, op_name, task.sale, checker)

                        return res.ok(task);
                    })
            })
            .catch(err => res.serverError(err))
    },

    undoSale: function (req, res) {
        let companyId = req.param('company_id')
        let clientName = req.param('client_name')
        let taskId = req.param('task_id')
        let oldSale = req.param('old_sale')
        let updater = req.param('updater')
        let check_time = moment().format('YYYY-MM-DD')

        let task = {}

        task.price = 0
        task.sale = 0
        task.checker = updater
        task.check_time = check_time
        task.saleOpDisable = false

        CheckService.checkClientName(companyId, clientName)
            .then(_client => {
                return Task.update({id: taskId, client_id: _client.id}, task)
            })
            .then(_task => {
                if (!_task[0] || _task[0].length === 0) return res.notFound({err: 'No task found in our record'});
                Task.findOne({id: _task[0].id}).populate('client')
                    .then((task, err) => {
                        if (err) {
                            return res.serverError(err);
                        }

                        task.client_name = task.client.client_name
                        task.client_id = task.client.id

                        let op_name = '撤销记录'
                        AccountService.accountReceivableCr(task.company, task.client_name, op_name, oldSale, updater)

                        return res.ok(task);
                    })
            })
            .catch(err => res.serverError(err))
    },

    finishTask: function (req, res) {
        let companyId = req.param('company_id')
        let clientName = req.param('client_name')
        let taskId = req.param('task_id')

        let task = {}

        task.status = true

        CheckService.checkClientName(companyId, clientName)
            .then(_client => {
                return Task.update({id: taskId, client_id: _client.id}, task)
            })
            .then(_task => {
                if (!_task[0] || _task[0].length === 0) return res.notFound({err: 'No task found in our record'});
                Task.findOne({id: _task[0].id}).populate('client')
                    .then((task, err) => {
                        if (err) {
                            return res.serverError(err);
                        }
                        task.client_name = task.client.client_name
                        task.client_id = task.client.id
                        return res.ok(task);
                    })
            })
            .catch(err => res.serverError(err))
    }
};

