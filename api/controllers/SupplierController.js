/**
 * SuplierController
 *
 * @description :: Server-side logic for managing Supliers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const CheckService = require('../services/checkService')

module.exports = {
  create: function (req, res) {
    let companyId = req.param('company_id')
    let supplierName = req.param('supplier_name')
    let desc = req.param('desc') || ''
    let payable = Number(req.param('payable')) || 0.0

    if (!companyId) {
      return res.badRequest({ err: 'Invalid company_id' });
    }

    if (!supplierName) {
      return res.badRequest({ err: 'Invalid supplier_name' });
    }


    CheckService.checkCompanyId(companyId)
      .then(_company => {
        return Supplier.create({
          supplier_name: supplierName,
          desc: desc,
          payable: payable,
          company: _company.id,
        });
      })
      .then(_supplier => {
        if (!_supplier) throw new Error('Unable to create new client')
        return res.ok(_supplier)
      })
      .catch(err => res.serverError(err.message));
  },


  delete: function (req, res) {
    let companyId = req.param('company_id')
    let supplierId = req.param('supplier_id')

    CheckService.checkCompanyId(companyId)
      .then(_company => {
        return Supplier.destroy({ id: supplierId, company_id: _company.id })
      })
      .then(_supplier => {
        if (!_supplier || _supplier.length === 0) return res.notFound({ err: 'No client found in our record' });
        return res.ok({status:200,msg:'delete ok'});
      })
  },

  listAllSuppliers: function (req, res) {
    let companyId = req.param('company_id')
    CheckService.checkCompanyId(companyId)
      .then(_company => {
        return Supplier.find({ company_id: _company.id }).populate('company')
      })
      .then(_suppliers => {
        if (!_suppliers ) {
          throw new Error('No task found');
        }
        if(_suppliers.length === 0){
          return res.ok({status:201,msg:'suppliers empty'});
        }
        _suppliers.map(s=>{
          s.company_name = s.company.company_name
        })
        return res.ok(_suppliers);
      })
      .catch(err => res.serverError(err));
  },


  update: function (req, res) {
    let companyId = req.param('company_id')
    let supplierName = req.param('supplier_name')
    let supplierId = req.param('supplier_id') || ''
    let desc = req.param('desc') || ''
    let payable = Number(req.param('payable')) || 0.0

    if (!supplierId) return res.badRequest({ err: 'supplier id is missing' });

    let supplier = {};
    supplier.supplier_name = supplierName;
    supplier.desc = desc;
    supplier.payable = payable;



    CheckService.checkCompanyId(companyId)
      .then(_company => {
        return Supplier.update({ id: supplierId, company_id: _company.id }, supplier)
      })
      .then(_supplier => {
        if (!_supplier[0] || _supplier[0].length === 0) return res.notFound({ err: 'No supplier found' });
        Supplier.findOne({ id: _supplier[0].id }).populate('company')
          .then((supplier, err) => {
            if (err) {
              return res.serverError(err);
            }
            supplier.company_name = supplier.company.company_name
            return res.ok(supplier);
          })
      })
      .catch(err => res.serverError(err))
  },


  getSupplierById: function (req, res) {
    let supplierId = req.params.id

    Supplier.findOne({ id: supplierId }).populate('company')
      .then((_supplier, err) => {
        if (err) {
          return res.serverError(err);
        }
        if (!_supplier) {
          return res.notFound('Could not find client, sorry.');
        }
        _supplier.company_name = _supplier.company.company_name
        return res.ok(_supplier);
      })
  },

  deleteSupplierById: function (req, res) {
    let supplierId = req.params.id

    Supplier.destroy({ id: supplierId })
      .then(_supplier => {
        if (!_supplier || _supplier.length === 0) return res.notFound({ err: 'No supplier found in our record' });
        return res.ok({status:200,msg:'delete ok'});
      })
  },

};

