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
    account : String,
    password : String,
    type: Number,  //用户类型 0:根管理员 1:学生 2:教师 3:科研成果管理员 4:财务管理员 5:固定资产管理员
    name : String,
    email : String,
    phone : String,
    state : Number,//0未激活 1激活
    teacher : String,//非学生时此项为null
    projects : Array,//学生参加的项目列表或老师所拥有的项目列表
    time : Date
});
/************** 定义模式projectapplySchema **************/
const projectapplySchema = mongoose.Schema({
	account : String,
	projectId : String,
	teacher : String,
	state : Number,
	time : Date
});
/************** 定义模式projectSchema **************/
 const projectSchema = mongoose.Schema({
    name : String,
    teacher: String,
    students: Array,
    id: String,//项目编号
    group : String,
    account : String,//涉及钱的那个账号
    description: String,
    time : Date
 });
/************** 定义模式projectGSchema **************/
const projectGSchema = mongoose.Schema({
	name : String,
	id : String,//项目组编号
	caption : String,
	projects : Array,
	teachers : Array,
	students : Array,
	time : Date
});
/************** 定义模式sthesisSchema **************/
const sthesisSchema = mongoose.Schema({
	title : String,
	id : String,
	authors : Array,
	apply : String,//这条纪录由谁申请的
	projectId : Array,
	teacher : String,
	account : String,
	state : Number,
	content : String,//存储pdf文件在服务器端的路径名
	cost : Number,
	time : Date
});
/************** 定义模式gthesisSchema **************/
const gthesisSchema = mongoose.Schema({
	title : String,
	id : String,
	authors : String,
	apply : String,
	projectId : String,
	teacher : String,//指导老师，是该学生对应的唯一的指导老师
	editor : String,//审核老师，是该学生自己填的审核的老师
	state : Number,
	content : String,//存储pdf文件在服务器端的路径名
	time : Date
});
/************** 定义模式patentSchema **************/
const patentSchema = mongoose.Schema({
	name : String,
	id : String,
  noticeId: String,
  patentId: String,
	applicant : String,
	inventor : Array,
	apply : String,
	projectId : String,
	state : Number,
	description : String,
	applystate : Number,
	content : String,
	cost : Number,
	time : Date
});
/************** 定义模式assetsSchema **************/
const assetsSchema = mongoose.Schema({
	id : String,//商品统一编码
	deviceId : String,//设备号
	band : String,//设备名
	name : String,//设备厂商
	model : String,//型号
	purchaseDate : Date,//购买时间
	cost : Number,//价格
	projectId : String,//项目号
	account : String,//账号
	deviceState : String,//设备状态1：正常 2：待修 3：报废
	user : String,//使用人，就是报账的这个用户
	ticket : String,//报账票据集合为一个pdf文件后上传
	state : Number,//申请审批状态
	teacher : String,//负责申购申请审批的老师
	time : Date//该条目生成时间

});
/************** 定义模式renderSchema **************/
const renderSchema = mongoose.Schema({
	id : String,
	kind : String,
	description : String,
  teacher: String,
	account : String,
	apply : String,
	projectId : String,
	cost : Number,
	state : Number,
	ticket : String,//报账票据集合成一个pdf文件后上传
	time : Date
});
/************** 定义模型Model **************/
const Models = {
	//登录模型
    Login : mongoose.model('userinfos',loginSchema,'userInfos'),
    //管理员模型
//    Admin : mongoose.model('admin',userSchema,'userInfos'),
    //学生模型
//    Student : mongoose.model('student',userSchema,'userInfos'),
    //老师模型
//    Teacher : mongoose.model('teacher',userSchema,'userInfos'),
    //项目模型
    Project : mongoose.model('project',projectSchema,'projectS'),
    //项目组模型
    ProjectG : mongoose.model('projectG',projectGSchema,'projectGroup'),
    //小论文模型
    Sthesis : mongoose.model('sthesis',sthesisSchema,'sThesis'),
    //毕业论文模型
    Gthesis : mongoose.model('gthesis',gthesisSchema,'gThesis'),
    //专利模型
    Patent : mongoose.model('patent',patentSchema,'patentS'),
    //固定资产模型
    Assets : mongoose.model('assets',assetsSchema,'fixedAssets'),
    //不入库报账模型
    Render : mongoose.model('render',renderSchema,'renderAccount'),
    //学生加入项目申请模型
    Projectapply : mongoose.model('projectapply',projectapplySchema,'projectApplys')
}

module.exports = Models;
