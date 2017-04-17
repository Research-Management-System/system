// Schema、Model、Entity或者Documents的关系请牢记，Schema生成Model，Model创造Entity，Model和Entity都可对数据库操作造成影响，但Model比Entity更具操作性。
const mongoose = require('mongoose');
// 连接数据库 如果不自己创建 默认test数据库会自动生成
mongoose.connect('mongodb://localhost/researchSystem');

// 为这次连接绑定事件
const db = mongoose.connection;
db.once('error',() => console.log('Mongo connection error'));
db.once('open',() => console.log('Mongo connection successed'));
/************** 定义模式loginSchema **************/
const loginSchema = mongoose.Schema({
    account : Number,
    password : String,
    type: Number  //用户类型 0:根管理员 1:学生 2:教师 3:xx管理员 4:xx管理员
});
/************** 定义模式projectSchema **************/
// const projectSchema = mongoose.Schema({
//     name : String,
//     group : Number,
//     number: Number,
//     teachers: Array,
//     students: Array,
//     description: String
// });
/************** 定义模型Model **************/
const Models = {
    Login : mongoose.model('userinfos',loginSchema)
}

module.exports = Models;
