/**
 * WarehouseDashController
 *
 * @description :: Server-side logic for managing Warehouse Dash
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const CheckService = require('../services/checkService')

module.exports = {

    listAllItemsByItemName:function (req,res) {
        let companyId = req.param('company_id')
        let item_name = req.param('item_name')


        WarehouseItem.find({company_id:companyId,item_name:item_name}).populate('supplier')
            .then(_warehouseItems =>{
                if (!_warehouseItems ) {
                    return res.ok({status:404})
                }
                if(_warehouseItems.length === 0){
                    return res.ok({status:201,msg:'tasks empty'});
                }
                _warehouseItems.map(i=>{
					i.balance = Number(i.balance).toFixed(2)
                    i.supplier_name = i.supplier.supplier_name
                    i.supplier_id = i.supplier.id
                })
                return res.ok({status:200,warehouseItems:_warehouseItems});
            })
            .catch(err => res.serverError(err));
    },

    computeRatio:function (req,res) {
        let companyId = req.param('company_id')
        let item_id = req.param('item_id')

        WarehouseItem.findOne({company_id:companyId,id:item_id})
            .then(item=>{
                WarehouseStockOp.find({company_id:companyId,warehouseItem:item_id}).sort('op_date DESC')
                    .then(stockOps=>{
                        if(stockOps.length===0){
                            let total = Number(item.init_balance).toFixed(2)
                            let now = Number(item.balance).toFixed(2)
                            let ratio = {
                                total:total,
                                now:now
                            }
                            return res.ok({status:200,ratio:ratio})
                        }
                        else{
                            let total = Number(stockOps[0].new_balance).toFixed(2)
                            let now = Number(item.balance).toFixed(2)
                            let ratio = {
                                total:total,
                                now:now
                            }
                            return res.ok({status:200,ratio:ratio})
                        }
                    })
            })
    }
}
