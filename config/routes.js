/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/
  'GET *': { controller: 'App', action: 'serve', skipAssets: true, skipRegex: /^\/api\/.*$/ },


  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/
  //company
  'POST /company': 'CompanyController.create',
  'GET /company': 'CompanyController.listAllCompanies',

  //user
  'POST /user': 'UserController.create',
  'POST /user/admin': 'UserController.createAdmin',
  'POST /users': 'userController.listAllUsers',
  'PUT /user': 'userController.update',
  'PUT /user/password': 'userController.changePassword',
  'DELETE /user': 'userController.delete',
  'DELETE /user/:id': 'userController.deleteUserById',
  'POST /user/login': 'UserController.login',
  'POST /user/logout': 'UserController.logout',

  //client
  'POST /client': 'ClientController.create',
  'DELETE /client': 'ClientController.delete',
  'POST /clients': 'ClientController.listAllClients',
  'PUT /client': 'ClientController.update',
  // 'PUT /client/:id': 'ClientController.updateById',
  'GET /client/:id': 'ClientController.getClientById',
  'DELETE /client/:id': 'ClientController.deleteClientById',

  //supplier
  'POST /supplier': 'SupplierController.create',
  'DELETE /supplier': 'SupplierController.delete',
  'POST /suppliers': 'SupplierController.listAllSuppliers',
  'PUT /supplier': 'SupplierController.update',
  // 'PUT /client/:id': 'ClientController.updateById',
  'GET /supplier/:id': 'SupplierController.getSupplierById',
  'DELETE /supplier/:id': 'SupplierController.deleteSupplierById',

  //account
  'POST /accounts/client': 'AccountController.listAccountsByClient',
  'POST /accounts/supplier': 'AccountController.listAccountsBySupplier',
  'POST /accounts/receivablecr': 'AccountController.createClientReceivableCr',
  'POST /accounts/payablecr': 'AccountController.createSupplierPayableCr',
  'POST /accounts/payabledr' :'AccountController.createSupplierPayableDr',


  //warehouse
  'POST /warehouse/item': 'WarehouseController.createItem',
  'DELETE /warehouse/item': 'WarehouseController.deleteItem',
  'DELETE /warehouse/item/:id': 'WarehouseController.deleteItemById',
  'POST /warehouse/items': 'WarehouseController.listAllItemsByCompany',
  'PUT /warehouse/item': 'WarehouseController.updateItem',
  'PUT /warehouse/item/stock': 'WarehouseController.stockItem',

  //warehouse item op
  'POST /warehouse/itemop': 'WarehouseController.createItemOp',
  'DELETE /warehouse/itemop': 'WarehouseController.deleteItemOp',
  'DELETE /warehouse/itemop/:id': 'WarehouseController.deleteItemOpById',
  'POST /warehouse/itemop/undo': 'WarehouseController.undoItemOp',
  'POST /warehouse/itemops': 'WarehouseController.listAllItemOpsByCompany',
  'PUT /warehouse/itemop': 'WarehouseController.updateItemOp',
  'POST /warehouse/itemop/check': 'WarehouseController.checkItemOp',


  //tasks
  'POST /task': 'TaskController.create',
  'POST /tasks': 'TaskController.listAllTasksByCompany',
  'POST /tasksByClient': 'TaskController.listAllTasksByClient',
  'DELETE /task': 'TaskController.delete',
  'DELETE /task/:id': 'TaskController.deleteTaskById',
  'PUT /task': 'TaskController.update',
  'PUT /task/finish': 'TaskController.finishTask',
  'PUT /task/sale': 'TaskController.updateSale',
  'PUT /task/sale/undo': 'TaskController.undoSale',

  //task wastes
  'POST /taskwaste': 'TaskWasteController.createTaskWaste',
  'POST /taskwastes': 'TaskWasteController.listTaskWastesByCompany',
  'DELETE /taskwaste/:id': 'TaskWasteController.deleteTaskWasteById',
  'PUT /taskwaste': 'TaskWasteController.updateTaskWaste',


  //sales dash
  'POST /salesdash/today': 'SalesDashController.listTodaySales',
  'POST /salesdash/sofar': 'SalesDashController.getMonthSoFarSales',
  'POST /salesdash/eachday': 'SalesDashController.getEachMonthDaySales',

  //warehouse dash
  'POST /warehousedash/items': 'WarehouseDashController.listAllItemsByItemName',
  'POST /warehousedash/ratio': 'WarehouseDashController.computeRatio'
};
