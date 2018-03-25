const bcrypt = require('bcrypt');

const PasswordService = {

  checkPassword: function (inputPassword, rightPassword) {
    return bcrypt.compareSync(inputPassword, rightPassword)
  },


};


module.exports = PasswordService;
