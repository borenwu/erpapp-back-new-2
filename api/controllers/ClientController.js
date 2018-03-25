/**
 * ClientController
 *
 * @description :: Server-side logic for managing Clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const CheckService = require('../services/checkService')

module.exports = {

  create: function (req, res) {
    let companyId = req.param('company_id')
    let clientName = req.param('client_name')
    let desc = req.param('desc') || ''
    let receivable = Number(req.param('receivable')) || 0.0

    if (!companyId) {
      return res.badRequest({ err: 'Invalid company_id' });
    }

    if (!clientName) {
      return res.badRequest({ err: 'Invalid client_name' });
    }


    CheckService.checkCompanyId(companyId)
      .then(_company => {
        return Client.create({
          client_name: clientName,
          desc: desc,
          receivable: receivable,
          company: _company.id,
        });
      })
      .then(_client => {
        if (!_client) throw new Error('Unable to create new client')
        return res.ok(_client)
      })
      .catch(err => res.serverError(err.message));
  },

  delete: function (req, res) {
    let companyId = req.param('company_id')
    let clientId = req.param('client_id')

    CheckService.checkCompanyId(companyId)
      .then(_company => {
        return Client.destroy({ id: clientId, company_id: _company.id })
      })
      .then(_client => {
        if (!_client || _client.length === 0) return res.notFound({ err: 'No client found in our record' });
        return res.ok({status:200,msg:'delete ok'});
      })
  },

  listAllClients: function (req, res) {
    let companyId = req.param('company_id')
    CheckService.checkCompanyId(companyId)
      .then(_company => {
        return Client.find({ company_id: _company.id }).populate('company')
      })
      .then(_clients => {
        if (!_clients ) {
            return res.ok({status:404});
        }
        if(_clients.length === 0){
          return res.ok({status:201,msg:'clients empty'});
        }
        _clients.map(c=>{
          c.company_name = c.company.company_name
        })
        return res.ok(_clients);
      })
      .catch(err => res.serverError(err));
  },

  update: function (req, res) {
    let companyId = req.param('company_id')
    let clientName = req.param('client_name')
    let clientId = req.param('client_id') || ''
    let desc = req.param('desc') || ''
    let receivable = Number(req.param('receivable')) || 0.0

    if (!clientId) return res.badRequest({ err: 'client id is missing' });

    let client = {};
    client.client_name = clientName;
    client.desc = desc;
    client.receivable = receivable;


    console.log(client)

    CheckService.checkCompanyId(companyId)
      .then(_company => {
        return Client.update({ id: clientId, company_id: _company.id }, client)
      })
      .then(_client => {
        if (!_client[0] || _client[0].length === 0) return res.notFound({ err: 'No client found' });
        Client.findOne({ id: _client[0].id }).populate('company')
          .then((client, err) => {
            if (err) {
              return res.serverError(err);
            }
            client.company_name = client.company.company_name
            return res.ok(client);
          })
      })
      .catch(err => res.serverError(err))
  },


  // updateById: function (req, res) {
  //   let clientId = req.param('client_id') || ''
  //   let clientName = req.param('client_name')
  //   let desc = req.param('desc') || ''
  //   let receivable = Number(req.param('receivable')) || 0.0
  //
  //   if (!clientId) return res.badRequest({ err: 'client id is missing' });
  //
  //   let client = {};
  //
  //   if (clientName) {
  //     client.client_name = clientName
  //   }
  //
  //   if (desc) {
  //     client.desc = desc;
  //   }
  //   if (receivable) {
  //     client.receivable = receivable;
  //   }
  //
  //   Client.update({ id: clientId }, client)
  //     .then(_client => {
  //       if (!_client[0] || _client[0].length === 0) return res.notFound({ err: 'No client found' });
  //      _client[0].company_name = _client[0].company.company_name
  //       return res.ok(_client[0]);
  //     })
  //     .catch(err => res.serverError(err))
  // },

  getClientById: function (req, res) {
    let clientId = req.params.id

    Client.findOne({ id: clientId }).populate('company')
      .then((_client, err) => {
        if (err) {
          return res.serverError(err);
        }
        if (!_client) {
          return res.notFound('Could not find client, sorry.');
        }
        _client.company_name = _client.company.company_name
        return res.ok(_client);
      })
  },

  deleteClientById: function (req, res) {
    let clientId = req.params.id

    Client.destroy({ id: clientId })
      .then(_client => {
        if (!_client || _client.length === 0) return res.notFound({ err: 'No client found in our record' });
        return res.ok({status:200,msg:'delete ok'});
      })
  },

};




