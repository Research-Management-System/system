// 可能是我的node版本问题，不用严格模式使用ES6语法会报错
"use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();

// 创建账号接口
// router.post('/api/login/createAccount',(req,res) => {
//     // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
//     let newAccount = new models.Login({
//         account : req.body.account,
//         password : req.body.password
//     });
//     // 保存数据newAccount数据进mongoDB
//     newAccount.save((err,data) => {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send('createAccount successed');
//         }
//     });
// });
//查询登录状态
/***********返回值说明
%_%成功则返回一个data对象的json，其接口如下,仅userinfo属性为单个对象，其他8个属性均为数组，
请使用如projects[0]这种方式进行提取内部数据，每条数据的结构即为对应数据库的结构，该结构
请查询db.js文件。
var data = {
  userinfo 
  projectapply 
  projects 
  projectGs 
  sthesises 
  gthesises 
  patents 
  assets 
  renders 
}
%_%失败。返回null说明未登录，返回"0"则说明数据库中不存在传入的用户。
**********************/
router.get('/api/isLogin',(req,res) => {
  
  var userinfo1;//用户信息
  var projectapply1;//申请项目信息
  var projects1;//参与的项目信息
  var projectGs1;//参与的项目组信息
  var sthesises1;//发表的小论文信息
  var gthesises1;//该用户的毕业论文信息
  var patents1;//申请的专利信息
  var assets1;//固定资产报销信息
  var renders1;//普通报销信息

  if(req.session.account){
    models.Login.find({account:req.session.account},(err,userinfo) => {
      if(err){          //未找到该用户
        let msg = "0";
        res.send(msg);        
      } else {          //找到该用户
        userinfo1 = userinfo[0];
        if(userinfo[0].type === 1){       //如果是学生，返回相关的数据
           models.Projectapply.find({account:req.session.account},(err,projectapply) =>{
             if(err){
               projectapply1 = null;
             } else {
              projectapply1 = projectapply;
            }
            models.Project.find({students:req.session.account},(err,projects) =>{
              if(err){
                projects1 = null;
              } else{
               projects1 = projects;
              }
              models.ProjectG.find({students:req.session.account},(err,projectGs) =>{
                if(err){
                  projectGs1 = null;
                } else{
                 projectGs1 = projectGs;
                }
                models.Sthesis.find({$or:[{authors:req.session.account},{apply:req.session.account}]},(err,sthesises) =>{
                 if(err){
                   sthesises1 = null;
                 } else{
                   sthesises1 = sthesises;
                 }
                 models.Gthesis.find({$or:[{authors:req.session.account},{apply:req.session.account}]},(err,gthesises) =>{
                  if(err){
                    gthesises1 = null;
                  } else{
                    gthesises1 = gthesises;
                  }
                  models.Patent.find({$or:[{applicant:req.session.account},{inventor:req.session.account},{apply:req.session.account}]},(err,patents) =>{
                   if(err){
                     patents1 = null;
                   } else{
                     patents1 = patents;
                   }
                   models.Assets.find({user:req.session.account},(err,assets) =>{
                    if(err){
                      assets1 = null;
                    } else{
                      assets1 = assets;
                    }
                    models.Render.find({apply:req.session.account},(err,renders) =>{
                     if(err){
                       renders1 = null;
                     } else{
                       renders1 = renders;
                     }

                     var data = {
                      userinfo : userinfo1,
                      projectapply : projectapply1,
                      projects : projects1,
                      projectGs : projectGs1,
                      sthesises : sthesises1,
                      gthesises : gthesises1,
                      patents : patents1,
                      assets : assets1,
                      renders : renders1
                     }
                     console.log(data);
                     res.send(data);
                     console.log("用户信息返回成功...........");
                    });
                   });
                  });
                 });
                });
              });
            });
           });

        } else {                          //如果不是学生，则返回所有的数据
          models.Projectapply.find({teacher:req.session.account},(err,projectapply) =>{
            if(err){
              projectapply1 = null;
            } else {
             projectapply1 = projectapply;
           }
           models.Project.find({},(err,projects) =>{
             if(err){
               projects1 = null;
             } else{
              projects1 = projects;
             }
             models.ProjectG.find({},(err,projectGs) =>{
               if(err){
                 projectGs1 = null;
               } else{
                projectGs1 = projectGs;
               }
               models.Sthesis.find({$or:[{},{apply:req.session.account}]},(err,sthesises) =>{
                if(err){
                  sthesises1 = null;
                } else{
                  sthesises1 = sthesises;
                }
                models.Gthesis.find({$or:[{},{apply:req.session.account}]},(err,gthesises) =>{
                 if(err){
                   gthesises1 = null;
                 } else{
                   gthesises1 = gthesises;
                 }
                 models.Patent.find({$or:[{},{inventor:req.session.account},{apply:req.session.account}]},(err,patents) =>{
                  if(err){
                    patents1 = null;
                  } else{
                    patents1 = patents;
                  }
                  models.Assets.find({},(err,assets) =>{
                   if(err){
                     assets1 = null;
                   } else{
                     assets1 = assets;
                   }
                   models.Render.find({},(err,renders) =>{
                    if(err){
                      renders1 = null;
                    } else{
                      renders1 = renders;
                    }

                    var data = {
                     userinfo : userinfo1,
                     projectapply : projectapply1,
                     projects : projects1,
                     projectGs : projectGs1,
                     sthesises : sthesises1,
                     gthesises : gthesises1,
                     patents : patents1,
                     assets : assets1,
                     renders : renders1
                    }
                    console.log(data);
                    res.send(data);
                    console.log("用户信息返回成功...........");

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
  }else{            //未登录
    res.send(req.session.account);
  }
});
//注销接口
router.get('/api/logoff',(req,res) => {
  req.session.account = null;
  res.send("log off success!");
});
// 登录接口
/***********返回值说明
%_%成功则返回一个data对象的json并把登录成功的用户的account纪录在session中，该json接口
如下,仅userinfo属性为单个对象，其他8个属性均为数组，请使用如projects[0]这种方式进行提
取内部数据，每条数据的结构即为对应数据库的结构，该结构请查询db.js文件。
var data = {
  userinfo 
  projectapply 
  projects 
  projectGs 
  sthesises 
  gthesises 
  patents 
  assets 
  renders 
}
%_%失败。返回"1"说明密码错误，返回"0"则说明用户名错误。
*******************/
router.post('/api/login/getAccount',(req,res) => {
    // 通过模型去查找数据库
    let account = req.body.account;
    let password = req.body.password;

    var userinfo1;//用户信息
    var projectapply1;//申请项目信息
    var projects1;//参与的项目信息
    var projectGs1;//参与的项目组信息
    var sthesises1;//发表的小论文信息
    var gthesises1;//该用户的毕业论文信息
    var patents1;//申请的专利信息
    var assets1;//固定资产报销信息
    var renders1;//普通报销信息
    //console.log(data);
    //查询是否能够登录，错误返回错误信息，正确返回相关数据
    models.Login.find({account:account},(err,userinfo) => {
        if (!userinfo[0]) {
            let msg = "0";  //没有该用户
            res.send(msg);
        } else if(userinfo[0].password != password){
            let msg = "1";  //密码错误
            res.send(msg);
        } else {
            req.session.account = account;
            userinfo1 = userinfo[0];
            if(userinfo[0].type === 1){       //如果是学生，返回相关的数据
               models.Projectapply.find({account:req.session.account},(err,projectapply) =>{
                 if(err){
                   projectapply1 = null;
                 } else {
                  projectapply1 = projectapply;
                }
                models.Project.find({students:req.session.account},(err,projects) =>{
                  if(err){
                    projects1 = null;
                  } else{
                   projects1 = projects;
                  }
                  models.ProjectG.find({students:req.session.account},(err,projectGs) =>{
                    if(err){
                      projectGs1 = null;
                    } else{
                     projectGs1 = projectGs;
                    }
                    models.Sthesis.find({$or:[{authors:req.session.account},{apply:req.session.account}]},(err,sthesises) =>{
                     if(err){
                       sthesises1 = null;
                     } else{
                       sthesises1 = sthesises;
                     }
                     models.Gthesis.find({$or:[{authors:req.session.account},{apply:req.session.account}]},(err,gthesises) =>{
                      if(err){
                        gthesises1 = null;
                      } else{
                        gthesises1 = gthesises;
                      }
                      models.Patent.find({$or:[{applicant:req.session.account},{inventor:req.session.account},{apply:req.session.account}]},(err,patents) =>{
                       if(err){
                         patents1 = null;
                       } else{
                         patents1 = patents;
                       }
                       models.Assets.find({user:req.session.account},(err,assets) =>{
                        if(err){
                          assets1 = null;
                        } else{
                          assets1 = assets;
                        }
                        models.Render.find({apply:req.session.account},(err,renders) =>{
                         if(err){
                           renders1 = null;
                         } else{
                           renders1 = renders;
                         }

                         var data = {
                          userinfo : userinfo1,
                          projectapply : projectapply1,
                          projects : projects1,
                          projectGs : projectGs1,
                          sthesises : sthesises1,
                          gthesises : gthesises1,
                          patents : patents1,
                          assets : assets1,
                          renders : renders1
                         }
                         console.log(data);
                         res.send(data);
                         console.log("用户信息返回成功...........");
                        });
                       });
                      });
                     });
                    });
                  });
                });
               });

            } else {                          //如果不是学生，则返回所有的数据
              models.Projectapply.find({teacher:req.session.account},(err,projectapply) =>{
                if(err){
                  projectapply1 = null;
                } else {
                 projectapply1 = projectapply;
               }
               models.Project.find({},(err,projects) =>{
                 if(err){
                   projects1 = null;
                 } else{
                  projects1 = projects;
                 }
                 models.ProjectG.find({},(err,projectGs) =>{
                   if(err){
                     projectGs1 = null;
                   } else{
                    projectGs1 = projectGs;
                   }
                   models.Sthesis.find({$or:[{},{apply:req.session.account}]},(err,sthesises) =>{
                    if(err){
                      sthesises1 = null;
                    } else{
                      sthesises1 = sthesises;
                    }
                    models.Gthesis.find({$or:[{},{apply:req.session.account}]},(err,gthesises) =>{
                     if(err){
                       gthesises1 = null;
                     } else{
                       gthesises1 = gthesises;
                     }
                     models.Patent.find({$or:[{},{inventor:req.session.account},{apply:req.session.account}]},(err,patents) =>{
                      if(err){
                        patents1 = null;
                      } else{
                        patents1 = patents;
                      }
                      models.Assets.find({},(err,assets) =>{
                       if(err){
                         assets1 = null;
                       } else{
                         assets1 = assets;
                       }
                       models.Render.find({},(err,renders) =>{
                        if(err){
                          renders1 = null;
                        } else{
                          renders1 = renders;
                        }

                        var data = {
                         userinfo : userinfo1,
                         projectapply : projectapply1,
                         projects : projects1,
                         projectGs : projectGs1,
                         sthesises : sthesises1,
                         gthesises : gthesises1,
                         patents : patents1,
                         assets : assets1,
                         renders : renders1
                        }
                        console.log(data);
                        res.send(data);
                        console.log("用户信息返回成功...........");

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
      let msg = "修改成功";
      res.send(msg);
    }
  })
});
module.exports = router;
