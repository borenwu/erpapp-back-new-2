/**
 * CompanyController
 *
 * @description :: Server-side logic for managing Company
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `UserController.create()`
   */
  create: function (req, res) {
    let companyName = req.param('company_name')
    let secret = req.param('secret');

    if (!companyName) {
      return res.badRequest({ err: 'Invalid company_name' });
    }

    const companyInfo = {
      company_name:companyName,
      secret:secret
    }

    Company.findOrCreate({company_name: companyName, secret: secret},companyInfo)
      .then(_company => {
        if (!_company) return _company.serverError({ err: 'Unable to create company' });

        return res.ok({status:200,company:_company}); //to learn more about responses check api/responses folder
      })
      .catch(err => res.serverError(err.message));
  },

  listAllCompanies: function (req, res) {
    Company.find({})
      .then(_companies => {
        if (!_companies || _companies.length === 0) {
          throw new Error('No company found');
        }
        return res.ok(_companies);
      })
      .catch(err=> res.serverError(err))
  },

};

