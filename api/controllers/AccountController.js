/**
 * AccountController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const CheckService = require('../services/checkService')
const AccountService = require('../services/AccountService')

module.exports = {

    createClientReceivableCr: function (req, res) {
        let company_id = req.param('company_id')
        let client_name = req.param('client_name')
        let op_name = req.param('op_name')
        let amount = req.param('amount')
        let maker = req.param('maker')
        let invoice = req.param('invoice')

        AccountService.accountReceivableCr(company_id, client_name, op_name, amount, maker, invoice)
            .then(account=>{
                res.ok({status:200,account:account})
            })


    },

    listAccountsByClient:function (req,res) {
        let companyId = req.param('company_id')
        let client_name = req.param('client_name')
        let startDate = req.param('start_date')
        let endDate = req.param('end_date')

        CheckService.checkClientName(companyId,client_name)
            .then(client=>{
                return Account.find({op_date:{'>=':startDate,'<=':endDate},client_id:client.id}).populate('client')
            })
            .then(accounts=>{
                if (!accounts) {
                    return res.ok({status: 200, msg: 'no accounts found'});
                }
                if (accounts.length === 0) {
                    return res.ok({status: 201, msg: 'accounts empty'});
                }
                accounts.map(a => {
                    a.client_name = a.client.client_name
                })
                return res.ok(accounts);
            })
            .catch(err => res.serverError(err));
    },

    listAccountsBySupplier:function (req,res) {
        let companyId = req.param('company_id')
        let supplier_name = req.param('supplier_name')
        let startDate = req.param('start_date')
        let endDate = req.param('end_date')

        CheckService.checkSupplierName(companyId,supplier_name)
            .then(supplier=>{
                return Account.find({op_date:{'>=':startDate,'<=':endDate},suplier_id:supplier.id}).populate('suplier')
            })
            .then(accounts=>{
                if (!accounts) {
                    return res.ok({status: 200, msg: 'no accounts found'});
                }
                if (accounts.length === 0) {
                    return res.ok({status: 201, msg: 'accounts empty'});
                }
                accounts.map(a => {
                    a.supplier_name = a.suplier.suplier_name
                })
                return res.ok(accounts);
            })
            .catch(err => res.serverError(err));
    },




};

