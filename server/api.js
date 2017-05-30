// 可能是我的node版本问题，不用严格模式使用ES6语法会报错
"use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();
// const formidable = require('formidable');
const fs = require('fs');
const multiparty = require('multiparty');
const util = require('util');
//上传接口down
router.post('/api/upload', function(req, res) {
	//生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({uploadDir: '../static/'});
  //上传完成后处理
  form.parse(req, function(err, fields, files) {
    var filesTmp = JSON.stringify(files,null,2);
  	if(err){
      console.log('parse error: ' + err);
    } else {
      console.log('parse files: ' + filesTmp);
      var inputFile = files.inputFile[0];
      var uploadedPath = inputFile.path;
      var dstPath = '../static/'+ req.session.account + '-'+ inputFile.originalFilename;
      //重命名为真实文件名
      fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
          console.log('rename error: ' + err);
        } else {
          console.log('rename ok');
					res.send({"filePath":dstPath});
        }
      });
    }
    // res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
   // 	res.end(util.inspect({fields: fields, files: filesTmp}));
 	});
});
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
      }else if(allData.userInfo.type === 2){
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
                      models.Render.find({teacher:account},(err,renders) => {
                        allData.renders = renders;
                        res.send(allData);
                      });
                    });
                  });
                });
              });
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
                        models.Login.find({type:2,state:0},(err,signInApply) => {
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
//注销接口down
router.get('/api/logoff',(req,res) => {
  req.session.account = null;
  res.send("log off success!");
});
// 登录接口down
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
            }else if(allData.userInfo.type === 2){
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
                            models.Render.find({teacher:account},(err,renders) => {
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
			                        models.Login.find({type:2,state:0},(err,signInApply) => {
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
});
//修改密码down
router.post('/api/changePassword',(req,res) => {
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
//重置密码down
router.post('/api/resetPassword',(req,res) => {
	let account = req.body.account;
	models.Login.update({'account':account},{$set:{'password':account}},function(err){
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
//用户注册down
router.post('/api/signIn',(req,res) => {
  let account = req.body.account;
  let password = req.body.password;
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let type = req.body.type;
  let teacher = req.body.teacher;
	var user = {
		type : type,
		name : name,
		account : account,
		password : password,
		email : email,
		phone : phone,
		state : 0,
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
//修改用户信息down
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
//审核项目加入申请down
router.post('/api/checkJoinProject',(req,res) => {
  let account = req.body.account;
  let projectId = req.body.id;
  let state = req.body.state;
  models.Projectapply.update({$and:[{'account':account},{'projectId':projectId}]},{$set:{'state':state}},(err) => {
    if(err){
      console.log(err);
      res.send("0");
    }else{
      if(state === 1){
        console.log("同意申请"+account);
        models.Login.update({'account':account},{$addToSet:{'projects':projectId}},(err) => {
          models.Project.update({'id':projectId},{$addToSet:{'students':account}},(err) => {
            models.ProjectG.update({'projects':projectId},{$addToSet:{'students':account}},(err) => {
              models.Projectapply.update({state: state},(err) =>{
                res.send("1");
              });
            });
          });
        });
      }else{
        models.Projectapply.update({state: state},(err) =>{
					console.log("拒绝申请"+account);
          res.send("2");
        });
      }
    }
  });
});
//学生加入项目申请down
router.post('/api/joinProject',(req,res) => {
  let account = req.body.account;
  let projectId = req.body.id;
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
//新建项目组down
router.post('/api/createProjectGroup',(req,res) => {
  let name = req.body.name;
  let caption = req.body.caption;
  models.ProjectG.count((err,count) => {
  	count++;
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
//新建项目down
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
//固定资产管理---------------------------------------------------------
//20行 上传固定资产票据down
router.post('/api/submitAssetFile',(req,res) => {
	let id = req.body.id;
	let path = req.body.path;
	models.Assets.update({'id':id},{$set:{'ticket':path,'state': 4}},(err) => {
		if(err){
		  console.log(err);
		  res.send("0");
		}else{
		  res.send("1");
		}
	});
});
//修改固定资产信息down
router.post('/api/submitAssetInfo',(req,res) => {
	let deviceId = req.body.deviceId;
	let name = req.body.name;
	let id = req.body.id;
	let band = req.body.band;
	let model = req.body.model;
	let projectId = req.body.projectId;
	let cost = req.body.cost;
	let deviceState = req.body.deviceState;
	let purchaseDate = req.body.purchaseDate;
	models.Assets.update({'id':id},{$set:{'deviceId':deviceId,'deviceState':deviceState,'model':model,'band':band,'cost':cost,'purchaseDate':purchaseDate,'name':name}},(err) => {
		if(err){
		  console.log(err);
		  res.send("0");
		}else{
		  res.send("1");
		}
	});
});
//22行 checkAsset 固定资产管理员最终审核
router.post('/api/checkAsset',(req,res) => {
	let id = req.body.id;
	let state = req.body.state;
	models.Assets.update({'id':id},{$set:{'state':state}},(err) => {
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
	switch(choice){
		case 1:
			models.Assets.update({'id':id},{$set:{'state':state}},(err) => {
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
//32行 submitRenderInfos 上传报账票据down
router.post('/api/submitRenderInfos',(req,res) => {
	let id = req.body.id;
	let path = req.body.path;
	models.Render.update({'id':id},{$set:{'ticket':path,'state':4}},(err) => {
		if(err){
		  console.log(err);
		  res.send("0");
		}else{
		  res.send("1");
		}
	});
});
//38行 sthesisApply 提交小论文申请down
router.post('/api/sthesisApply',(req,res) => {
	let teacher = req.body.teacher;
	let title = req.body.title;
	let authors = req.body.authors;
	let cost = req.body.cost;
	let path = req.body.path;
	let content = path;
	models.Sthesis.count((err,count) => {
		count++;
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
//39行 checkSthesisApply 老师审核申请down
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
//48行 gthesisApply 提交毕业论文申请down
router.post('/api/gthesisApply',(req,res) => {
	let title = req.body.title;
	let authors = req.body.authors;
	let editor = req.body.editor;
	let teacher = req.body.teacher;
	let apply = req.session.account;
	let path = req.body.path;
	let content = path;
	models.Gthesis.count((err,count) => {
		count++;
		var id = (new Date().getFullYear())+"07"+(Array(5).join('0')+count).slice(-5);
		var data = {
			title : title,
			id : id,
			authors : authors,
			apply : apply,
			projectId : "",
			teacher : teacher,
			editor : editor,
			state : 1,
			content : content,
			time : new Date()
		};
		models.Gthesis.create(data,(err) => {
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
//49行 checkGthesisApply 老师审核申请down
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
//50行 submitGthesisInfos 提交毕业论文最终pdf版down
router.post('/api/submitGthesisInfos',(req,res) => {
	let id = req.body.id;
	let state = req.body.state;
	let path = req.body.path;
	let content = path;
	console.log(content);
	models.Gthesis.update({'id':id},{$set:{'state':state,'content':content}},(err) => {
		if(err){
		  console.log(err);
		  res.send("0");
		}else{
		  res.send("1");
		}
	});
});
//21行 downloadFiles 下载文件down
router.get('/api/downloadFiles',(req,res) => {
	let id = req.query.id;
	let choice = req.query.choice;
	console.log(choice);
	if(choice == 1){
			models.Assets.findOne({'id':id},(err,data) => {
				if(err){
					console.log(err);
					res.send("0");
				}else{
					console.log(data.ticket);
					res.download(data.ticket,function(err){
			        if(err)
			            console.log(err);
			        else
			            console.log("download successfully");
			    });
				}
			});
		}
		else if(choice == 2){
			models.Render.findOne({'id':id},(err,data) => {
				if(err){
					console.log(err);
					res.send("0");
				}else{
					console.log(data.ticket);
					res.download(data.ticket,function(err){
			        if(err)
			            console.log(err);
			        else
			            console.log("download successfully");
			    });
				}
			});
		}
		else if(choice == 3){
			models.Patent.findOne({'id':id},(err,data) => {
				if(err){
					console.log(err);
					res.send("0");
				}else{
					console.log(data.content);
					res.download(data.content,function(err){
			        if(err)
			            console.log(err);
			        else
			            console.log("download successfully");
			    });
				}
			});
		}
		else if(choice == 4){
			models.Gthesis.findOne({'id':id},(err,data) => {
				if(err){
					console.log(err);
					res.send("0");
				}else{
					console.log(data.content);
					res.download(data.content,function(err){
			        if(err)
			            console.log(err);
			        else
			            console.log("download successfully");
			    });
				}
			});
		}
		else if(choice == 5){
			models.Sthesis.findOne({'id':id},(err,data) => {
				if(err){
					console.log(err);
					res.send("0");
				}else{
					console.log(data.content);
					res.download(data.content,function(err){
			        if(err)
			            console.log(err);
			        else
			            console.log("download successfully");
			    });
				}
			});
		}
		else{
			console.log("choice错误！修改状态失败！");
			res.send("0");
		}
});
//学生向老师提交购买申请(固定资产入库)
router.post('/api/assetApply',(req,res)=>{
  let band = req.body.band;
  let name = req.body.name;
  let model =req.body.model;
  let cost = req.body.cost;
  let projectId = req.body.projectId;
  let teacher = req.body.teacher;
  let user = req.session.account;
  models.Assets.count((err,count) => {
    count=count+1;
    var id = (new Date().getFullYear())+"03"+(Array(5).join('0')+count).slice(-5); //id:年份+“03”+“固定资产购买申请数+1”，固定11位
    var asset = {
      id :id,
      deviceId : "",//设备号
      band : band,//设备名
      name : name,//设备厂商
      model : model,//型号
      purchaseDate : null,//购买时间
      cost : cost,//价格
      projectId : projectId,//项目号
      account : "",//账号
      deviceState : "",//设备状态1：正常 2：待修 3：报废
      user : user,//使用人，就是报账的这个用户
      ticket : "",//报账票据集合为一个pdf文件后上传
      state : 1,//申请审批状态
      teacher : teacher,//负责申购申请审批的老师
      time : new Date()//该条目生成时间
    };
    models.Assets.create(asset,function(err){
      if(err){
        res.send("0");
      }else{
        res.send("1");
      }
    });
  });
});
//老师审核购买申请(固定资产入库)
router.post('/api/checkAssetApply',(req,res)=>{
  let id = req.body.id;
  let state = req.body.state;
  models.Assets.update({'id':id},{$set:{'state': state}},function (err) {
  	if(err){
  		res.send("0");
  	}else {
  		res.send("1");
  	}
  });
});
//修改设备状态(固定资产入库)
router.post('/api/changeState',(req,res)=>{
  let id = req.body.id;
  let devicestate = req.body.devicestate;
  models.Assets.update({'id':id},{'$set':{'devicestate':devicestate}},function (err) {
    if(err){
      res.send("0");
    }else {
      res.send("1");
    }
  });
});
//提交报账申请(不入库报账)down
router.post('/api/renderApply',(req,res)=>{
  let kind = req.body.kind;
  let description = req.body.description;
  let cost = req.body.cost;
  let projectId = req.body.projectId;
  let apply = req.session.account;
	let teacher = req.body.teacher;
  models.Render.count((err,count) => {
    count=count+1;
    var id = (new Date().getFullYear())+"04"+(Array(5).join('0')+count).slice(-5); //id:年份+“04”+“报账申请数+1”
    var render = {
      id : id,
      kind : kind,
      description : description,
      account : "",
      apply : apply,
      projectId : projectId,
      cost : cost,
      state : 1,
			teacher: teacher,
      ticket : "",//报账票据集合成一个pdf文件后上传
      time : new Date()
    }
    models.Render.create(render,function (err) {
      if(err){
        res.send("0");
      }else {
        res.send("1");
      }
    });
  });
});
//老师审核报账申请（不入库报账）down
router.post('/api/checkRenderApply',(req,res)=>{
  let id = req.body.id;
  let state = req.body.state;
  models.Render.update({'id':id},{'$set':{'state':state}},function (err) {
    if(err){
      res.send("0");
    }else {
      res.send("1");
    }
  });
});
//财管审核并回复账号
router.post('/api/checkAccount',(req,res) => {
  let id = req.body.id;
  let account = req.body.account;
  let choice = req.body.choice;
  //根据id查找数据库的数据，并将其state改为3。
  switch(choice){
		case 1:
			models.Assets.update({ 'id':id },{$set:{'state' : 3,'account' : account}},(err) => {
			    if(err){
			      console.log(err);
			      res.send("0");
			    }else{
			      console.log("update state and account success");
			      res.send("1");
			    }
			  });
			break;
		case 2:
			models.Render.update({ 'id':id },{$set:{'state' : 3,'account' : account}},(err) => {
			    if(err){
			      console.log(err);
			      res.send("0");
			    }else{
			      console.log("update state and account success");
			      res.send("1");
			    }
			  });
			break;
		case 3:
			models.Sthesis.update({ 'id':id },{$set:{'state' : 3,'account' : account}},(err) => {
			    if(err){
			      console.log(err);
			      res.send("0");
			    }else{
			      console.log("update state and account success");
			      res.send("1");
			    }
			  });
			break;
		case 4:
			models.Patent.update({ 'id':id },{$set:{'state' : 3,'account' : account}},(err) => {
			    if(err){
			      console.log(err);
			      res.send("0");
			    }else{
			      console.log("update state and account success");
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
//上传发表过的pdf(小论文流程)
router.post('/api/submitSthesisInfos',(req,res) => {
  let id = req.body.id;
  let path = req.body.path;
  models.Sthesis.update({ 'id':id },{$set:{'content' : path,'state':4}},(err) => {
	if(err){
	  	console.log(err);
	    res.send("0");
	}else{
	    console.log("upload file success");
	    res.send("1");
	}
  });
});
//科研成果管理员最终审核
router.post('/api/checkAchievements',(req,res) => {
  let id = req.body.id;
  let state = req.body.state;
  let choice = req.body.choice;
  //根据id查找数据库的数据，并将其state改为5。
  switch(choice){
	case 1:
		models.Sthesis.update({ 'id':id },{$set:{'state' : state}},(err) => {
		    if(err){
		      console.log(err);
		      res.send("0");
		    }else{
		      console.log("update finally state success");
		      res.send("1");
		    }
		  });
		break;
	case 2:
		models.Gthesis.update({ 'id':id },{$set:{'state' : state}},(err) => {
		    if(err){
		      console.log(err);
		      res.send("0");
		    }else{
		      console.log("update finally state success");
		      res.send("1");
		    }
		  });
		break;
	case 3:
		models.Patent.update({ 'id':id },{$set:{'state' : state}},(err) => {
		    if(err){
		      console.log(err);
		      res.send("0");
		    }else{
		      console.log("update finally state success");
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
//提交专利申请down
router.post('/api/patentApply',(req,res) => {
  let name = req.body.name;
  let applicant = req.body.applicant;
  let inventor = req.body.inventor;
  let apply = req.session.account;//到底是啥
  let projectId = req.body.projectId;
  let description = req.body.description;
  models.Patent.count((err,count) => {
  	count++;
    let id = (new Date().getFullYear())+"08"+(Array(5).join('0')+count).slice(-5);
    var patent = {
      name : name,
      id : id,
			noticeId: "",
			patentId: "",
      applicant : applicant,
      inventor : inventor,
      apply : apply,
      projectId : projectId,
      state : 1,
      description : description,
      applystate : 0,
      content : "",
      cost : 0,
      time : new Date()
    }
    models.Patent.create(patent,(err) => {
      if(err){
        console.log("创建失败"+err);
        res.send("0");
      }else{
        console.log("create patent success");
        res.send("1");
      }
    });
  });
});
//上传受理通知书和专利申请号以及费用预算down
router.post('/api/uploadAcceptance',(req,res) =>{
  let id = req.body.id;
  let noticeId = req.body.noticeId;
  // let applystate = req.body.applystate;
  let cost = req.body.cost;
  let path = req.body.path;
  models.Patent.update({ 'id':id },{$set:{'noticeId':noticeId,'content':path,'cost':cost,'state':2}},(err) => {
  	if(err){
	    console.log("更新失败");
	    console.log(err);
	    res.send("0");
	}else{
	    console.log("update patent success");
	    res.send("1");
	}
  });
});
//修改专利申请状态
// router.post('/api/changeApplyState',(req,res) => {
//   let id = req.body.id;
//   let applystate = req.body.applystate;
//
//   models.Patent.update({ 'id':id },{$set:{'applystate' : applystate}},(err,result) => {
//     if(err){
//       console.log("更新失败"+err);
//       res.send("0");
//     }else{
//       console.log("update patent success");
//       res.send("1");
//     }
//   });
// });

//上传专利证书down
router.post('/api/uploadCertificate',(req,res) => {
  let id = req.body.id;
  // let applystate = req.body.applystate;
  let patentId = req.body.patentId;
  let path = req.body.path;
  let contentpath = path;
  models.Patent.update({ 'id':id },{$set:{'id':patentId,'content':contentpath,'state': 4}},(err) => {
  	if(err){
    	console.log("更新失败"+err);
    	res.send("0");
  	}else{
    	console.log("update patent success");
    	res.send("1");
  	}
　});
});
module.exports = router;
