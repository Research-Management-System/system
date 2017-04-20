var mydate = Date();
//根管理员
rootmanage = {
	type : 0,
	name : "Root Manager",
	account : "OUCroot",
	password : "rootroot",
	email : "ternencewind@outlook.com",
	phone : "15395189961",
	state : 1,
	teache : null,
	projects : null,
	time : null
};
//财务管理员
finamanage = {
	type : 4,
	name : "Financial Manager",
	account : "OUCroot4",
	password : "123456",
	email : "ternencewind@outlook.com",
	phone : "15395189961",
	state : 1,
	teache : null,
	projects : null,
	time : null
};
//科研成果管理员
researchmanage = {
	type : 3,
	name : "Research Manager",
	account : "OUCroot3",
	password : "123456",
	email : "ternencewind@outlook.com",
	phone : "15395189961",
	state : 1,
	teache : null,
	projects : null,
	time : null
};
//固定资产管理员
assetsmanage = {
	type : 5,
	name : "Assets Manager",
	account : "OUCroot5",
	password : "123456",
	email : "ternencewind@outlook.com",
	phone : "15395189961",
	state : 1,
	teache : null,
	projects : null,
	time : null
};
//创建学生数据
student = {
	type : 1,
	name : "张尚斌",
	account : "13020031154",
	password : "123456",
	email : "1377694900@qq.com",
	phone : "15908934985",
	state : 1,
	teacher : "568842",
	projects : ["20171302001"],//学生参加的项目列表
	time : mydate
};
//创建老师数据
teacher = {
	type : 2,
	name : "盛艳秀",
	account : "568842",
	password : "123456",
	email : "284735268@qq.com",
	phone : "18661632737",
	state : 1,
	teacher : null,
	projects : ["20171302001"],//老师所拥有的项目列表
	time : mydate
};
//创建项目数据
project = {
	name : "科研项目过程管理系统开发",
	teacher : "568842",
	students : ["13020031154"],
	id : "20171302001",
	group : "2017001",
	account : "123456789",
	description : "这是一个毕业设计的项目",
	time : mydate
};
//创建项目组数据
projectG = {
	name : "软件工程开发课题组",
	id : "2017001",
	caption : "568842",//课题组组长
	projects : ["20171302001"],
	teachers : ["568842"],
	students : ["13020031154"],
	time : mydate
};
//创建小论文
sthesis = {
	title : "论联合政府",
	id : "201709001",
	authors : ["毛泽东","周恩来"],
	apply : "568842",
	projectId : ["20171302001"],
	account : "123456789",
	state : 0,
	content : "./Sthesis/论联合政府.pdf",
	cost : 500,
	time : mydate
}
//创建毕业论文
gthesis = {
	title : "关于科研项目管理系统的研究",
	id : "201708001",
	authors : "张尚斌",
	apply : "13020031154",
	projectId : "20171302001",
	teacher : "568842",//指导老师，是该学生对应的唯一的指导老师
	editor : "568842",//审核老师，是该学生自己填的审核的老师
	state : 0,
	content : "./Gthesis/关于科研项目管理系统的研究.pdf",
	time : mydate
}
//创建专利
patent = {
	name : "具有加热设备的辐射探测器",
	id : "CN201580002725.7",
	applicant : "中国海洋大学",
	inventor : ["张尚斌"],
	apply : "568842",
	projectId : "20171302001",
	state : 1,
	description : "关于辐射探测器的改进",
	applystate : 1,
	content : "./Patents/具有加热设备的辐射探测器.pdf",
	cost : 400,
	time : mydate
}
//创建固定资产
assets = {
	id : "6947503750190",//商品统一编码
	deviceId : "5616549864",//设备号
	name : "华硕笔记本电脑",//设备名
	band : "华硕ASUS",//设备厂商
	model : "FX50J",//型号
	purchaseDate : new Date("2017-03-15"),//购买时间
	cost : 6000,//价格
	projectId : "20171302001",//项目号
	account : "123456789",//账号
	deviceState : 1,//设备状态1：正常 2：待修 3：报废
	user : "13020031154",//使用人
	ticket : "./Tickets/20170000002.pdf",//报账票据集合为一个pdf文件后上传
	state : 1,//申请审批状态
	time : mydate//该条目生成时间
}

//创建不入库报账
render = {
	id : "20170000001",
	kind : "差旅费",
	description : "去西安来回差旅费共2000元人名币",
	account : "123456789",
	apply : "13020031154",
	cost : 2000,
	state : 2,
	ticket : "./Tickets/20170000001.pdf",//报账票据集合成一个pdf文件后上传
	time : mydate
}

//建立链接
mongo = new Mongo("localhost");
newDB = mongo.getDB("researchSystem");

//用户表
userInfos = newDB.createCollection("userInfos");
//课题组表
projectGroup = newDB.createCollection("projectGroup");
//项目表
projectS = newDB.createCollection("projectS");
//毕业论文表
gThesis = newDB.createCollection("gThesis");
//小论文表
sThesis = newDB.createCollection("sThesis");
//专利表
patentS = newDB.createCollection("patentS");
//固定资产入库报账表
fixedAssets = newDB.createCollection("fixedAssets");
//不入库报账表
renderAccount = newDB.createCollection("renderAccount");



newDB.runCommand({getLastError:1,w:1,j:true,wtimeout:1000});
userInfos = newDB.getCollection("userInfos");
projectGroup = newDB.getCollection("projectGroup");
projectS = newDB.getCollection("projectS");
gThesis = newDB.getCollection("gThesis");
sThesis = newDB.getCollection("sThesis");
patentS = newDB.getCollection("patentS");
fixedAssets = newDB.getCollection("fixedAssets");
renderAccount = newDB.getCollection("renderAccount");

//写入数据
userInfos.insert(rootmanage);
userInfos.insert(researchmanage);
userInfos.insert(finamanage);
userInfos.insert(assetsmanage);
userInfos.insert(student);
userInfos.insert(teacher);
projectS.insert(project);
projectGroup.insert(projectG);
gThesis.insert(gthesis);
sThesis.insert(sthesis);
patentS.insert(patent);
fixedAssets.insert(assets);
renderAccount.insert(render);