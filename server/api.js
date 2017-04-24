// 可能是我的node版本问题，不用严格模式使用ES6语法会报错
"use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();

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
                        res.send(allData);
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
});
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
                              res.send(allData);
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
//修改密码
router.post('/api/changePassword',(req,res) => {
  console.log(req.body.newPassword);
	//  console.log(req.body.oldPassword);
  let account = req.body.account;
  let password = req.body.newPassword;
	//  let prepassword = req.body.oldPassword;

  models.Login.update({$and:[{'account':account}/*,{'password':prepassword}*/]},{$set:{'password':req.body.newPassword}},function(err){
    if(err){
      console.log(err);
      let msg = 0;
      res.send(msg);
    }else{
      let msg = 1;
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
	var user = {
		type : type,
		name : name,
		account : account,
		password : password,		
		email : email,
		phone : phone,
		state : 0,
		teacher : teacher,
		projects : null,
		time : new Date()
	}
	models.Login.findOne({'account':account},function(err,data){
		if(err){
			console.log("err");
		}else{
			if(data===null){
				models.Login.create(user,function(err){
					if(err){
						let msg = 0;
						res.send(msg);
						console.log("注册失败");
					}else{
						res.send(1);
						console.log("注册成功");
					}
				});
			}else{
				let msg = 0;
				res.send(msg);
				console.log("不可重复注册");
			}
		}
	});
});

module.exports = router;
