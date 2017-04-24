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
        //考虑使用promise重写
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
router.post('/api/login/getAccount',(req,res) => {
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
  let account = req.body.account;
  let password = req.body.newPassword;
  models.Login.update({'account':account},{$set:{'password':password}},function(err){
    if(err){
      console.log(err);
    }else{
      let msg = "密码修改成功";
      res.send(msg);
    }
  })
});

//修改信息
router.post('/api/changeUserinfo',(req,res) => {
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  models.Login.update({'account':account},{$set:{'name':name , 'email':email , 'phone':phone}},function(err){
    if(err){
      console.log(err);
    }else{
      let msg = "个人信息修改成功";
      console.log("个人信息修改成功");//仅供测试用。
      res.send(msg);
    }
  })
});

//学生加入项目
router.post('/api/joinProject',(req,res) => {
  let warn = 0;
  let account = req.body.account;
  let projectId = req.body.projectId;
  let teacher = req.body.teacher;
  let state = 0;
  let time = Date;
  //查重
  let students = models.Project.findOne({id:projectId});
  let length = students.length;
  let i = 0;
  for (; i < len; ++i) {
    if(account === students[i])
      console.log("重复申请，出现错误");
      warn = 1;
  } 


  var data = [{"account":account,"projectId":projectId,"teacher":teacher,"state":state,"time":time}];
  models.Projectapply.insert(data, function(err, result) { 
      if(err||warn === 1){
          let msg = "申请失败";
          res.send(msg);
      }     
      else{
          let msg = "申请成功";
          console.log("申请成功");//仅供测试用。
          res.send(msg);
      }
  });
});

module.exports = router;
