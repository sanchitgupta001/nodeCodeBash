/**
 * Created by sanchitgupta001 on 12/07/18.
 */
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp').catch(e => console.log(e));

module.exports = {mongoose};
