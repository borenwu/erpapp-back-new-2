require('moment/locale/zh-cn')
const moment = require('moment')
moment.locale('zh-cn');


console.log(moment('2018-03-22T00:00:00.000Z').format('YYYY-MM-DD'))
console.log(moment('2018-03-22T00:00:00.000Z').format('YYYY[年]MMM'))
console.log(moment().format('YYYY[年]'))
