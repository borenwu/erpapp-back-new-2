const CheckService = require('./checkService')
const moment = require('moment')

const AccountService = {

    accountReceivableDr: function (companyId, clientName, op_name, amount, maker, invoice = '') {
        return new Promise((resolve, reject) => {
            CheckService.checkClientName(companyId, clientName)
                .then(_client => {
                    Account.create({
                        op_date: moment().format('YYYY-MM-DD'),
                        op_name: op_name,
                        direction: '借',
                        amount: amount,
                        invoice: invoice,
                        client: _client.id,
                        maker: maker
                    })
                        .then(account => {
                            _client.receivable = Number(_client.receivable) + Number(amount)
                            _client.save()
                            account.client_name = _client.client_name
                            resolve(account)
                        })
                })
        })

    },

    accountReceivableCr: function (companyId, clientName, op_name, amount, maker, invoice = '') {
        return new Promise((resolve, reject) => {
            CheckService.checkClientName(companyId, clientName)
                .then(_client => {
                    Account.create({
                        op_date: moment().format('YYYY-MM-DD'),
                        op_name: op_name,
                        direction: '贷',
                        amount: amount,
                        invoice: invoice,
                        client: _client.id,
                        maker: maker
                    })
                        .then(account => {
                            _client.receivable = Number(_client.receivable) - Number(amount)
                            _client.save()
                            account.client_name = _client.client_name
                            resolve(account)
                        })

                })
        })

    },


    accountPayableDr: function (companyId, supplierName, op_name, amount, maker, invoice = '') {
        return new Promise((resolve, reject) => {
            CheckService.checkSupplierName(companyId, supplierName)
                .then(_supplier => {
                    Account.create({
                        op_date: moment().format('YYYY-MM-DD'),
                        op_name: op_name,
                        direction: '借',
                        amount: amount,
                        invoice: invoice,
                        supplier: _supplier.id,
                        maker: maker
                    })
                        .then(account => {
                            _supplier.payable = Number(_supplier.payable) - Number(amount)
                            _supplier.save()
                            account.suppplier_name = _supplier.suppplier_name
                            resolve(account)
                        })
                })
        })

    },

    accountPayableCr: function (companyId, supplierName, op_name, amount, maker, invoice = '') {
        return new Promise((resolve, reject) => {
            CheckService.checkClientName(companyId, supplierName)
                .then(_supplier => {
                    Account.create({
                        op_date: moment().format('YYYY-MM-DD'),
                        op_name: op_name,
                        direction: '贷',
                        amount: amount,
                        invoice: invoice,
                        client: _supplier.id,
                        maker: maker
                    })
                        .then(account => {
                            _supplier.payable = Number(_supplier.payable) + Number(amount)
                            _supplier.save()
                            account.suppplier_name = _supplier.suppplier_name
                            resolve(account)
                        })
                })
        })
    }
}

module.exports = AccountService;
