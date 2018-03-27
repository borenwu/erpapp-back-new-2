require('moment/locale/zh-cn')
const moment = require('moment')
moment.locale('zh-cn');

let today = moment().format('YYYY-MM-DD')
console.log(today)
let month = moment().month()
console.log(moment().month(month).startOf('month').format('YYYY-MM-DD'))
let lastMonth = month - 1
console.log(moment().month(lastMonth).startOf('month').format('YYYY-MM-DD'))
console.log(moment().month(lastMonth).endOf('month').format('YYYY-MM-DD'))
console.log(moment().startOf('month').format('YYYY-MM-DD'))
