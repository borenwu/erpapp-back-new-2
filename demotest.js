require('moment/locale/zh-cn')
const moment = require('moment')
moment.locale('zh-cn');

let today = moment().format('YYYY-MM-DD')
let old = moment().subtract(7, 'months').format('YYYY-MM-DD');
console.log(old)
