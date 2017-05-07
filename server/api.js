// 可能是我的node版本问题，不用严格模式使用ES6语法会报错
"use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');

//文件处理函数
function upload(req,next){                         //next是回调函数
	/*这里是实际的
	var message = '';
	var form = new formidable.IncomingForm();//创建上传表单
	form.encoding = 'utf-8';
	form.uploadDir = '/files';
	form.keepExtensions = true;
	form.maxFieldsSize = 2 * 1024 * 1024;
	form.parse(req,function(err,fields,files){
		if(err){
			console.log(err);
		}
		var filename = files.resource.name;
		//对文件名进行处理，防止上传同名文件
		var nameArray = filename.split('.');
		var type = nameArray[nameArray.length-1];
		var name = '';
		for (var i = 0; i < nameArray.length-1; i++) {
			name = name + nameArray[i];
		}
		var rand = Math.random()*100 + 900;
		var num = parseInt(rand,10);
		var avatarName = name + num + '.' + type;
		var newPath = form.uploadDir + avatarName;
		fs.renameSync(files.resource.path,newPath);//重命名
		if(next && typeof(next) === "function"){
			next(newPath);
		}
	});*/
	//这里是测试时
	var newPath = "/files";//文件存储地址
	if(next && typeof(next) === "function"){
		next(newPath);
	}
}
//查询登录状态
router.get('/api/isLogin',(req,res) => {
  let account = req.session.account;
  if(account){
    models.Login.findOne({account:account},(err,data) => {
      let allData = {
        userInfo: data
      };
      if(allData.userInfo.type === 1){
        //考虑使用promise重写,处理回调地狱
        models.Project.find({students:account},(err,projects) => {
          allData.projects = projects;
          models.Projectapply.find({account:account},(err,projectApply) => {
            allData.projectApply = projectApply;
            // models.ProjectG.find({students:account},(err,projectGs) =>{
            //    allData.projectGs = projectGs;
            //  });
            models.Sthesis.find({apply:account},(err,sthesises) => {
              allData.sthesises = sthesises;
              models.Gthesis.find({apply:account},(err,gthesises) => {
                allData.gthesises = gthesises;
                models.Patent.find({apply:account},(err,patents) => {
                  allData.patents = patents;
                  models.Assets.find({user:account},(err,assets) => {
                    allData.assets = assets;
                    models.Render.find({apply:account},(err,renders) => {
                      allData.renders = renders;
                      res.send(allData);
                    });
                  });
                });
              })
            });
          });
        });
      }else{
        models.Project.find((err,projects) => {
          allData.projects = projects;
          models.Projectapply.find({teacher:account},(err,projectApply) => {
            allData.projectApply = projectApply;
            models.ProjectG.find((err,projectGs) =>{
              allData.projectGs = projectGs;
              models.Sthesis.find((err,sthesises) => {
                allData.sthesises = sthesises;
                models.Gthesis.find((err,gthesises) => {
                  allData.gthesises = gthesises;
                  models.Patent.find((err,patents) => {
                    allData.patents = patents;
                    models.Assets.find((err,assets) => {
                      allData.assets = assets;
                      models.Render.find((err,renders) => {
                        allData.renders = renders;
                        models.Login.find({teacher:account,state:0},(err,signInApply) => {
                          allData.signInApply = signInApply;
                          res.send(allData);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    });
  }else{
    res.send(account);
  }
});
//注销接口
router.get('/api/logoff',(req,res) => {
  req.session.account = null;
  res.send("log off success!");
});/*
// 登录接口
router.post('/api/login',(req,res) => {
    // 通过模型去查找数据库
    let account = req.body.account;
    let password = req.body.password;
    models.Login.findOne({account:account},(err,data) => {
        if (!data) {
            let msg = "0";
            res.send(msg);
        } else if(data.password != password){
            let msg = "1";
            res.send(msg);
        } else {
            req.session.account = account;
            let allData = {
              userInfo: data
            };
            if(allData.userInfo.type === 1){
              models.Project.find({students:account},(err,projects) => {
                allData.projects = projects;
                models.Projectapply.find({account:account},(err,projectApply) => {
                  allData.projectApply = projectApply;
                  // models.ProjectG.find({students:account},(err,projectGs) =>{
                  //    allData.projectGs = projectGs;
                  //  });
                  models.Sthesis.find({apply:account},(err,sthesises) => {
                    allData.sthesises = sthesises;
                    models.Gthesis.find({apply:account},(err,gthesises) => {
                      allData.gthesises = gthesises;
                      models.Patent.find({apply:account},(err,patents) => {
                        allData.patents = patents;
                        models.Assets.find({user:account},(err,assets) => {
                          allData.assets = assets;
                          models.Render.find({apply:account},(err,renders) => {
                            allData.renders = renders;
                            res.send(allData);
                          });
                        });
                      });
                    })
                  });
                });
              });
            }else{
              models.Project.find((err,projects) => {
                allData.projects = projects;
                models.Projectapply.find({teacher:account},(err,projectApply) => {
                  allData.projectApply = projectApply;
                  models.ProjectG.find((err,projectGs) =>{
                    allData.projectGs = projectGs;
                    models.Sthesis.find((err,sthesises) => {
                      allData.sthesises = sthesises;
                      models.Gthesis.find((err,gthesises) => {
                        allData.gthesises = gthesises;
                        models.Patent.find((err,patents) => {
                          allData.patents = patents;
                          models.Assets.find((err,assets) => {
                            allData.assets = assets;
                            models.Render.find((err,renders) => {
                              allData.renders = renders;
                              models.Login.find({teacher:account,state:0},(err,signInApply) => {
                                allData.signInApply = signInApply;
                                res.send(allData);
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            }
        }
    });
});*/
//修改密码
router.post('/api/changePassword',(req,res) => {
  console.log(req.body.newPassword);
	console.log(req.body.oldPassword);
  let account = req.body.account;
  let password = req.body.newPassword;
	let prepassword = req.body.oldPassword;

  models.Login.update({$and:[{'account':account},{'password':prepassword}]},{$set:{'password':req.body.newPassword}},function(err){
    if(err){
      console.log(err);
      let msg = "0";
      res.send(msg);
    }else{
      let msg = "1";
      res.send(msg);
    }
  });
});
//用户注册
router.post('/api/signIn',(req,res) => {
	let account = req.body.account;
	let password = req.body.password;
	let name = req.body.name;
	let email = req.body.email;
	let phone = req.body.phone;
	let type = req.body.type;
	let teacher = req.body.teacher;
  let state = 1;
  if(type===1){
    state = 0;
  }
	var user = {
		type : type,
		name : name,
		account : account,
		password : password,
		email : email,
		phone : phone,
		state : state,
		teacher : teacher,
		projects : new Array(),
		time : new Date()
	}
	models.Login.findOne({'account':account},function(err,data){
		if(err){
			console.log("err");
		}else{
			if(data===null){
				models.Login.create(user,function(err){
					if(err){
						let msg = "0";
						res.send(msg);
						console.log("注册失败");
					}else{
						res.send("1");
						console.log("注册成功");
					}
				});
			}else{
				let msg = "0";
				res.send(msg);
				console.log("不可重复注册");
			}
		}
	});
});
//修改用户信息
router.post('/api/changeUserinfo',(req,res) => {
  let account = req.body.account;
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  console.log(account+"用户修改信息");

  models.Login.update({'account':account},{$set:{'name':name,'email':email,'phone':phone}},function(err){
    if(err){
      console.log(err);
      res.send("0");
    }else{
      res.send("1");
    }
  });
});
//激活用户
router.post('/api/activeUser',(req,res) => {
  let account = req.body.account;
  models.Login.update({'account':account},{$set:{'state':1}},(err) => {
    if(err){
      console.log(err);
      res.send("0");
    }else{
      console.log("激活："+account);
      res.send("1");
    }
  });
});
//审核项目加入申请
router.post('/api/checkJoinProject',(req,res) => {
  let account = req.body.account;
  let projectId = req.body.id;
  let state = req.body.state;
  models.Projectapply.update({$and:[{'account':account},{'projectId':projectId}]},{$set:{'state':state}},(err) => {
    if(err){
      console.log(err);
      res.send("0");
    }else{
      if(state===1){
        console.log("同意申请"+account);
        models.Login.update({'account':account},{$addToSet:{'projects':projectId}},(err) => {
          models.Project.update({'id':projectId},{$addToSet:{'students':account}},(err) => {
            models.ProjectG.update({'projects':projectId},{$addToSet:{'students':account}},(err) => {
              models.Projectapply.update({state: 1},(err) =>{
                res.send("1");
              });
            });
          });
        });
      }else{
        models.Projectapply.update({state: 1},(err) =>{
          res.send("2");
        });
      }
    }
  });
});
//学生加入项目申请
router.post('/api/joinProject',(req,res) => {
  let account = req.body.account;
  let projectId = req.body.id;
  console.log(typeof(projectId));
  let state = 0;
  models.Projectapply.findOne({$and:[{'account':account},{'projectId':projectId}]},(err,apply) =>{
    if(apply){
      console.log("已申请，不可重复申请");
      res.send("0");
    }else{
      models.Project.findOne({'id':projectId},(err,data) => {
        if(data){
          var projectapply = {
            account : account,
            projectId : projectId,
            teacher : data.teacher,
            state : 0,
            time : new Date()
          }
          models.Projectapply.create(projectapply, function(err) {
            if(err){
              console.log(err);
              res.send("0");
            }
            else{
              console.log("成功申请"+account);
              res.send("1");
            }
          });
        }else{
          console.log("没有此项目");
          res.send("0");
        }
      });
    }
  });
});
//新建项目组
router.post('/api/createProjectGroup',(req,res) => {
  let name = req.body.name;
  let caption = req.body.caption;
  models.ProjectG.count((err,count) => {
    var id = (new Date().getFullYear())+"01"+(Array(5).join('0')+count).slice(-5);//01表示是项目组的id
    var projectG = {
      name : name,
      id : id,
      caption : caption,
      projects : new Array(),
      teachers : new Array(),
      students : new Array(),
      time : new Date()
    };
    models.ProjectG.create(projectG,(err) => {
      if(err){
        console.log("创建失败");
        res.send("0");
      }else{
        console.log("新建项目组"+id);
        res.send("1");
      }
    });
  });
});
//新建项目
router.post('/api/createProject',(req,res) => {
  let name = req.body.name;
  let teacher = req.body.teacher;
  let group = req.body.group;
  let account = req.body.account;
  let description = req.body.description;
  let id = req.body.id;
  //let id = "201702000001";//如果没传id可以用这个暂时测试
  //查询是否有这个id的项目了
  models.Project.findOne({'id':id},(err,data) => {
    if(data){
      console.log("该项目已经存在");
      res.send("0");
    }else{
      var project = {
        name : name,
        teacher : teacher,
        students : new Array(),
        id : id,
        group : group,
        account : account,
        description : description,
        time : new Date()
      };
      models.Project.create(project,(err) => {
        models.ProjectG.update({'id':group},{$addToSet:{'projects':id,'teachers':teacher}},(err) => {
          models.Login.update({'account':teacher},{$addToSet:{'projects':id}},(err) => {
            res.send("1");
          });
        });
      });
    }
  });
});


///////////////////////////////////////////////////


//20行 submitAssetInfos
router.post('/api/submitAssetInfos',(req,res) => {
	console.log("********");
	//let deviceId = req.body.deviceId;	
	//let oldId = req.body.oldId;
	//let newId = req.body.newId;
	//let purchaseDate = req.body.purchaseDate;
	let deviceId = "123456789";
	let oldId = "20170200002";
	let newId = "9876543231";
	let purchaseDate = new Date();
	//文件处理,再回调函数中处理其他信息
	upload(req,(path) => {
		let ticket = path;
		models.Assets.update({'id':oldId},{$set:{'id':newId,'deviceId':deviceId,'purchaseDate':purchaseDate,'ticket':ticket}},(err) => {
			if(err){
			  console.log(err);
			  res.send("0");
			}else{
			  res.send("1");
			}
		});
	});
});
//22行 checkAsset 固定资产管理员最终审核
router.post('/api/checkAsset',(req,res) => {

	//let id = req.body.id;
	//let state = req.body.state;
	let id = req.body.id;
	let state = 4;
	models.Asstes.update({'id':id},{$set:{'state':state}},(err) => {
		if(err){
		  console.log(err);
		  res.send("0");
		}else{
		  res.send("1");
		}
	});
});
//23行 checkMoney 财务管理员最终审核
router.post('/api/checkMoney',(req,res) => {
	let id = req.body.id;
	let state = req.body.state;
	let choice = req.body.choice;
	//let id = req.body.id;
	//let state = req.body.state;
	//let choice = req.body.choice;
	switch(choice){
		case 1:
			models.Asstes.update({'id':id},{$set:{'state':state}},(err) => {
				if(err){
				  console.log(err);
				  res.send("0");
				}else{
				  res.send("1");
				}
			});
			break;
		case 2:
			models.Render.update({'id':id},{$set:{'state':state}},(err) => {
				if(err){
				  console.log(err);
				  res.send("0");
				}else{
				  res.send("1");
				}
			});
			break;
		case 3:
			models.Sthesis.update({'id':id},{$set:{'state':state}},(err) => {
				if(err){
				  console.log(err);
				  res.send("0");
				}else{
				  res.send("1");
				}
			});
			break;
		case 4:
			models.Patent.update({'id':id},{$set:{'state':state}},(err) => {
				if(err){
				  console.log(err);
				  res.send("0");
				}else{
				  res.send("1");
				}
			});
			break;
		default:
			console.log("choice错误！修改状态失败！");
			res.send("0");
			break;
	}
});
//32行 submitRenderInfos 上传报账票据
router.post('/api/submitRenderInfos',(req,res) => {
	let id = req.body.id;
	//let id = req.body.id;
	upload(req,(path) => {
		let ticket = path;
		models.Render.update({'id':id},{$set:{'ticket':ticket}},(err) => {
			if(err){
			  console.log(err);
			  res.send("0");
			}else{
			  res.send("1");
			}
		});
	});
});
//38行 sthesisApply 提交小论文申请
router.post('/api/sthesisApply',(req,res) => {
	let teacher = req.body.teacher;
	let title = req.body.title;
	let authors = req.body.authors;
	let cost = req.body.cost;
	upload(req,(path) => {
		let content = path;
		models.Sthesis.count((err,count) => {
			var id = (new Date().getFullYear())+"06"+(Array(5).join('0')+count).slice(-5);
			var apply = {
				title : title,
				id : id,
				authors : authors,
				apply : req.session.account,
				projectId : new Array(),
				teacher : teacher,
				account : "",
				state : 1,
				content : content,
				cost : cost,
				time : new Date()
			};
			models.Sthesis.create(apply,(err) => {
				if(err){
				  console.log("创建失败");
				  res.send("0");
				}else{
				  console.log("新建小论文"+id);
				  res.send("1");
				}
			});
		});
	});
});
//39行 checkSthesisApply 老师审核申请
router.post('/api/checkSthesisApply',(req,res) => {
	let id = req.body.id;
	let state = req.body.state;
	let projectId = req.body.projectId;
	models.Sthesis.update({'id':id},{$set:{'state':state,'projectId':projectId}},(err) => {
		if(err){
		  console.log(err);
		  res.send("0");
		}else{
		  res.send("1");
		}
	});
});
//48行 gthesisApply 提交毕业论文申请
router.post('/api/gthesisApply',(req,res) => {
	let title = req.body.title;
	let authors = req.body.authors;
	let editor = req.body.editor;
	let teacher = req.body.teacher; 
	upload(req,(path) => {
		let content = path;
		models.Gthesis.count((err,count) => {
			var id = (new Date().getFullYear())+"07"+(Array(5).join('0')+count).slice(-5);
			var apply = {
				title : title,
				id : id,
				authors : authors,
				apply : req.session.account,
				projectId : "",
				teacher : teacher,
				editor : editor,
				state : 1,
				content : content,
				time : new Date()
			};
			models.Gthesis.create(apply,(err) => {
				if(err){
				  console.log("创建失败");
				  res.send("0");
				}else{
				  console.log("新建毕业论文"+id);
				  res.send("1");
				}
			});
		});
	});
});
//49行 checkGthesisApply 老师审核申请
router.post('/api/checkGthesisApply',(req,res) => {
	let id = req.body.id;
	let state = req.body.state;
	let projectId = req.body.projectId;
	models.Gthesis.update({'id':id},{$set:{'state':state,'projectId':projectId}},(err) => {
		if(err){
		  console.log(err);
		  res.send("0");
		}else{
		  res.send("1");
		}
	});
});
//50行 submitGthesisInfos 提交毕业论文最终pdf版
router.post('/api/submitGthesisInfos',(req,res) => {
	let id = req.body.id;
	let state = req.body.state;
	upload(req,(path) => {
		let content = path;
		models.Gthesis.update({'id':id},{$set:{'state':state,'content':content}},(err) => {
			if(err){
			  console.log(err);
			  res.send("0");
			}else{
			  res.send("1");
			}
		});
	});
});
module.exports = router;
