/**
 * WarehouseController
 *
 * @description :: Server-side logic for managing Supliers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const CheckService = require('../services/checkService')
const moment = require('moment')

module.exports = {

  /////////////////// warehouse item

  createItem: function (req, res) {
    let companyId = req.param('company_id')
    let supplierName = req.param('supplier_name')
    let itemName = req.param('item_name')
    let itemType = req.param('item_type')
    let desc = req.param('desc')
    let unit = req.param('unit')
    let balance = req.param('balance')

    CheckService.checkSupplierName(companyId, supplierName)
      .then(_supplier => {
        return WarehouseItem.create({
          item_name: itemName,
          item_type: itemType,
          desc: desc,
          unit: unit,
          balance: balance,
          init_balance: balance,
          constant:0,
          supplier: _supplier.id,
          company: companyId
        })
      })
      .then(_warehouseItem => {
        if (!_warehouseItem) throw new Error('Unable to create new warehouse item')
        _warehouseItem.supplier_name = supplierName
        return res.ok(_warehouseItem)
      })
      .catch(err => res.serverError(err.message));
  },

  deleteItem: function (req, res) {
    let companyId = req.param('company_id')
    let supplierName = req.param('supplier_name')
    let warehouseItemId = req.param('item_id')

    CheckService.checkSupplierName(companyId, supplierName)
      .then(_supplier => {
        return WarehouseItem.destroy({id: warehouseItemId, supplier_id: _supplier.id})
      })
      .then(_warehouseItem => {
        if (!_warehouseItem || _warehouseItem.length === 0) return res.notFound({err: 'No warehouse item found in our record'});
        return res.ok({status: 200, msg: 'delete ok'});
      })
  },

  deleteItemById: function (req, res) {
    let warehouseItemId = req.params.id

    WarehouseItem.destroy({id: warehouseItemId})
      .then(_warehouseItem => {
        if (!_warehouseItem || _warehouseItem.length === 0) return res.notFound({err: 'No warehouse item found in our record'});
        return res.ok({status: 200, msg: 'delete ok'});
      })
  },

  updateItem: function (req, res) {
    let warehouseItemId = req.param('item_id')
    let companyId = req.param('company_id')
    let supplierName = req.param('supplier_name')
    let itemName = req.param('item_name')
    let itemType = req.param('item_type')
    let desc = req.param('desc')
    let unit = req.param('unit')
    let balance = req.param('balance')
    let constant = Number(req.param('constant')) || 0.0

    if (!warehouseItemId) return res.badRequest({err: 'warehouse item id is missing'});

    let warehouseItem = {};
    warehouseItem.item_name = itemName;
    warehouseItem.item_type = itemType;
    warehouseItem.desc = desc;
    warehouseItem.unit = unit;
    warehouseItem.balance = balance;
    warehouseItem.constant = constant



    CheckService.checkSupplierName(companyId, supplierName)
      .then(_supplier => {
        return WarehouseItem.update({id: warehouseItemId, supplier_id: _supplier.id}, warehouseItem)
      })
      .then(_warehouseItem => {
        if (!_warehouseItem[0] || _warehouseItem[0].length === 0) return res.notFound({err: 'No warehouse item found in our record'});
        WarehouseItem.findOne({id: _warehouseItem[0].id}).populate('supplier')
          .then((warehouseItem, err) => {
            if (err) {
              return res.serverError(err);
            }
            warehouseItem.supplier_name = warehouseItem.supplier.supplier_name
            warehouseItem.supplier_id = warehouseItem.supplier.id
            return res.ok(warehouseItem);
          })
      })
      .catch(err => res.serverError(err))
  },

  stockItem: function (req, res) {
    let warehouseItemId = req.param('item_id')
    let companyId = req.param('company_id')
    let supplierName = req.param('supplier_name')
    let itemName = req.param('item_name')
    let itemType = req.param('item_type')
    let desc = req.param('desc')
    let unit = req.param('unit')
    let balance = req.param('balance')
    let amount = req.param('amount')
    let maker = req.param('maker')

    if (!warehouseItemId) return res.badRequest({err: 'warehouse item id is missing'});
    let warehouseItem = {};
    let new_balance = Number(balance) + Number(amount)
    warehouseItem.balance = new_balance

    CheckService.checkSupplierName(companyId, supplierName)
      .then(_supplier => {
        return WarehouseItem.update({id: warehouseItemId, supplier_id: _supplier.id}, warehouseItem)
      })
      .then(_warehouseItem => {
        if (!_warehouseItem[0] || _warehouseItem[0].length === 0) return res.notFound({err: 'No warehouse item found in our record'});
        WarehouseItem.findOne({id: _warehouseItem[0].id}).populate('supplier')
          .then((warehouseItem, err) => {
            if (err) {
              return res.serverError(err);
            }
            let stockOp = {
              op_date: moment().format('YYYY-MM-DD'),
              supplier_name: supplierName,
              item_name: itemName,
              item_type: itemType,
              unit: unit,
              amount: amount,
              new_balance: new_balance,
              maker: maker,
              warehouseItem: warehouseItem.id,
              company: companyId
            }
            WarehouseStockOp.create(stockOp)
              .then(warehouseStockOp => {
                warehouseItem.supplier_name = warehouseItem.supplier.supplier_name
                warehouseItem.supplier_id = warehouseItem.supplier.id
                return res.ok(warehouseItem);
              })
          })
      })
      .catch(err => res.serverError(err))

  },

  listAllItemsByCompany: function (req, res) {
    // console.log('listAllTasksByCompany')
    let companyId = req.param('company_id')

    WarehouseItem.find({company_id: companyId}).populate('supplier')
      .then(_warehouseItems => {
        if (!_warehouseItems) {
          throw new Error('No warehouse item found');
        }
        if (_warehouseItems.length === 0) {
          return res.ok({status: 201, msg: 'tasks empty'});
        }
        _warehouseItems.map(i => {
          i.supplier_name = i.supplier.supplier_name
          i.supplier_id = i.supplier.id
        })
        return res.ok(_warehouseItems);
      })
      .catch(err => res.serverError(err));
  },

  listAllItemsBySupplier: function (req, res) {
    let companyId = req.param('company_id')
    let supplierName = req.param('client_name')

    CheckService.checkSupplierName(companyId, supplierName)
      .then(_supplier => {
        return WarehouseItem.find({supplier_id: _supplier.id}).populate('supplier')
      })
      .then(_warehouseItems => {
        if (!_warehouseItems || _warehouseItems.length === 0) {
          throw new Error('No warehouse item found');
        }
        _warehouseItems.map(i => {
          i.supplier_name = i.supplier.supplier_name
          i.supplier_id = i.supplier.id
        })
        return res.ok(_warehouseItems);
      })
      .catch(err => res.serverError(err));
  },

  ////////////////////// warehouse item ops

  createItemOp: function (req, res) {
    let companyId = req.param('company_id')
    let itemId = req.param('item_id')
    let opDate = req.param('op_date')
    let supplier_name = req.param('supplier_name')
    let order = req.param('order')
    let re = req.param('re')
    let use = req.param('use')
    let waste = req.param('waste')
    let reason = req.param('reason') || ''
    let maker = req.param('maker')
    let make_time = req.param('make_time')

    CheckService.checkWarehouseItemId(companyId, itemId)
      .then(_warehouseItem => {
        return WarehouseOp.create({
          op_date: opDate,
          supplier_name: supplier_name,
          item_name: _warehouseItem.item_name,
          item_type: _warehouseItem.item_type,
          unit: _warehouseItem.unit,
          order: order,
          re: re,
          use: use,
          waste: waste,
          reason: reason,
          status: false,
          maker: maker,
          make_time: make_time,
          warehouseItem: _warehouseItem.id,
          company: companyId
        })
      })
      .then(_warehouseItemOp => {
        if (!_warehouseItemOp) throw new Error('Unable to create new warehouse item')
        return res.ok(_warehouseItemOp)
      })
      .catch(err => res.serverError(err.message));
  },

  deleteItemOp: function (req, res) {
    let companyId = req.param('company_id')
    let itemId = req.param('item_id')
    let itemOpId = req.param('op_id')

    CheckService.checkWarehouseItemId(companyId, itemId)
      .then(_warehouseItem => {
        return WarehouseOp.destroy({id: itemOpId, warehouseItem_id: _warehouseItem.id})
      })
      .then(_warehouseOp => {
        if (!_warehouseOp || _warehouseOp.length === 0) return res.notFound({err: 'No warehouse item op found in our record'});
        return res.ok({status: 200, msg: 'delete ok'});
      })
  },

  deleteItemOpById: function (req, res) {
    let warehouseItemOpId = req.params.id

    WarehouseOp.destroy({id: warehouseItemOpId})
      .then(_warehouseOp => {
        if (!_warehouseOp || _warehouseOp.length === 0) return res.notFound({err: 'No warehouse item op found in our record'});
        return res.ok({status: 200, msg: 'delete ok'});
      })
  },

  undoItemOp: function (req, res) {
    let companyId = req.param('company_id')
    let itemId = req.param('item_id')
    let itemOpId = req.param('op_id')
    let order = req.param('order')
    let re = req.param('re')

    CheckService.checkWarehouseItemId(companyId, itemId)
      .then(_warehouseItem => {
        let reduce = Number(order) - Number(re)
        _warehouseItem.balance = Number(_warehouseItem.balance) + Number(reduce)
        _warehouseItem.save()
        return WarehouseOp.destroy({id: itemOpId, warehouseItem_id: _warehouseItem.id})
      })
      .then(_warehouseOp => {
        if (!_warehouseOp || _warehouseOp.length === 0) return res.notFound({err: 'No warehouse item op found in our record'});
        return res.ok({status: 200, msg: 'delete ok'});
      })
      .catch(err => res.serverError(err))

  },

  updateItemOp: function (req, res) {
    let companyId = req.param('company_id')
    let itemId = req.param('item_id')
    let itemOpId = req.param('op_id')

    let order = req.param('order')
    let re = req.param('re')
    let use = req.param('use')
    let waste = req.param('waste')
    let reason = req.param('reason')
    let maker = req.param('maker')
    let make_time = moment().format('YYYY-MM-DD')


    let warehouseOp = {};
    warehouseOp.order = order
    warehouseOp.re = re
    warehouseOp.use = use
    warehouseOp.waste = waste
    warehouseOp.reason = reason
    warehouseOp.maker = maker
    warehouseOp.make_time = make_time


    CheckService.checkWarehouseItemId(companyId, itemId)
      .then(_warehouseItem => {
        return WarehouseOp.update({id: itemOpId, warehouseItem_id: _warehouseItem.id}, warehouseOp)
      })
      .then(_warehouseOp => {
        if (!_warehouseOp[0] || _warehouseOp[0].length === 0) return res.notFound({err: 'No warehouse item op found in our record'});
        res.ok(_warehouseOp[0])
      })
      .catch(err => res.serverError(err))
  },

  listAllItemOpsByCompany: function (req, res) {
    // console.log('listAllTasksByCompany')
    let companyId = req.param('company_id')
    let startDate = req.param('start_date')
    let endDate = req.param('end_date')

    WarehouseOp.find({company_id: companyId, op_date: {'>=': startDate, '<=': endDate}})
      .then(_warehouseOps => {
        if (!_warehouseOps) {
          throw new Error('No ops found');
        }
        if (_warehouseOps.length === 0) {
          return res.ok({status: 201, msg: 'ops empty'});
        }

        return res.ok(_warehouseOps);
      })
      .catch(err => res.serverError(err));
  },

  checkItemOp: function (req, res) {
    let companyId = req.param('company_id')
    let itemId = req.param('item_id')
    let itemOpId = req.param('op_id')
    let checker = req.param('checker')
    let check_time = moment().format('YYYY-MM-DD')
    let order = req.param('order')
    let re = req.param('re')

    let warehouseOp = {
      status: true,
      checker: checker,
      check_time: check_time
    };

    CheckService.checkWarehouseItemId(companyId, itemId)
      .then(_warehouseItem => {
        let reduce = Number(order) - Number(re)
        _warehouseItem.balance = Number(_warehouseItem.balance) - Number(reduce)
        _warehouseItem.save()
        return WarehouseOp.update({id: itemOpId, warehouseItem_id: _warehouseItem.id}, warehouseOp)
      })
      .then(_warehouseOp => {
        if (!_warehouseOp[0] || _warehouseOp[0].length === 0) return res.notFound({err: 'No warehouse item op found in our record'});
        res.ok(_warehouseOp[0])
      })
      .catch(err => res.serverError(err))
  }


}
