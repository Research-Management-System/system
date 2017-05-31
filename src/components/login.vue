<template>
  <div class="mod-login">
    <el-card class="box-card">
      <span class="logo"></span><h4 class="title">科研项目过程管理系统</h4>
      <el-input class="account" v-model="account" placeholder="学号/工号"></el-input>
      <el-input class="password" type="password" v-model="password" placeholder="密码"></el-input>
      <el-button type="primary" class="login-btn" @click="login">登录</el-button>
      <el-button type="text" class="sign-in" @click="signIn = true">注册</el-button>
    </el-card>
    <el-dialog title="用户注册" v-model="signIn">
      <el-form class="form-box" :model="signInForm" :rules="rules" ref="signInForm">
        <el-form-item prop="name">
          <el-input placeholder="姓名" type="name" auto-complete="off" v-model="signInForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="signAccount">
          <el-input placeholder="学/工号" type="account" auto-complete="off" v-model="signInForm.signAccount"></el-input>
        </el-form-item>
        <el-form-item prop="signPassword">
          <el-input placeholder="密码" type="password" auto-complete="off" v-model="signInForm.signPassword"></el-input>
        </el-form-item>
        <el-form-item prop="repeatPassword">
          <el-input placeholder="重复密码" type="password" auto-complete="off" v-model="signInForm.repeatPassword"></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="type">
          <el-radio-group v-model="signInForm.type">
            <el-radio label="1">学生</el-radio>
            <el-radio label="2">教师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="this.signInForm.type === '1'">
          <el-input placeholder="指导教师工号" type="text" auto-complete="off" v-model="signInForm.teacher"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input placeholder="邮箱" type="text" auto-complete="off" v-model="signInForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input placeholder="电话" type="text" auto-complete="off" v-model="signInForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="signIn = false">取消</el-button>
        <el-button type="primary" @click="userSignIn('signInForm')">注册</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import axios from 'axios';

    export default {
      data() {
          function validateName(rule, value, callback){
            if (value === '') {
              callback(new Error('请输入姓名'));
            } else if (!(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/).test(value)) {
              callback(new Error("姓名格式错误"));
            } else {
              callback();
            }
          };
          function validateAccount(rule, value, callback){
            if (value === '') {
              callback(new Error('请输入学工号'));
            } else if (!(/^([0-9]){6,11}$/).test(value)) {
              callback(new Error("学工号格式错误"));
            } else {
              callback();
            }
          };
          function validatePassword(rule, value, callback){
            if (value === '') {
              callback(new Error('请输入密码'));
            } else if (!(/^([\dA-Za-z]){6,11}$/).test(value)) {
              callback(new Error("密码格式错误，请输入6-11位字符"));
            } else {
              callback();
            }
          };
          function validateRepeat(rule, value, callback){
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (!(/^([\dA-Za-z]){6,11}$/).test(value)) {
              callback(new Error("密码不匹配"));
            } else {
              callback();
            }
          };
          function validateEmail(rule, value, callback){
            if (value === '') {
              callback(new Error('请输入邮箱'));
            } else if (!(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/).test(value)) {
              callback(new Error("邮箱格式错误"));
            } else {
              callback();
            }
          };
          function validatePhone(rule, value, callback){
            if (value === '') {
              callback(new Error('请输入手机号'));
            } else if (!(/^(\d){11}$/).test(value)) {
              callback(new Error("手机格式错误"));
            } else {
              callback();
            }
          };
          return {
              signInForm: {
                name: '',
                signAccount: '',
                signPassword: '',
                repeatPassword: '',
                type: '1',
                email: '',
                phone: '',
                teacher: ''
              },
              account : '',
              password : '',
              signIn: false,
              rules: {
                name:[
                    { validator: validateName, trigger: 'blur' }
                  ],
                signAccount:[
                    { validator: validateAccount, trigger: 'blur' }
                  ],
                signPassword:[
                    { validator: validatePassword, trigger: 'blur' }
                  ],
                repeatPassword:[
                    { validator: validateRepeat, trigger: 'blur' }
                  ],
                email:[
                    { validator: validateEmail, trigger: 'blur' }
                  ],
                phone:[
                    { validator: validatePhone, trigger: 'blur' }
                  ]
              }
          }
      },
      methods:{
        login() {
          let data = {
            account : this.account,
            password : this.password
          };
          axios.post('/api/login',data)
            .then((response) => {
              // 响应成功回调
              console.log(response.data);
              if(response.data === 0 || response.data === 1){
                this.$alert('账号/密码错误!', '提示', {
                  confirmButtonText: '确定'
                });
              }else{
                if(response.data.userInfo.state === 0){
                  this.$alert('账号尚未审核!', '提示', {
                    confirmButtonText: '确定'
                  });
                }else{
                  this.$emit("login",response.data);
                }
              }
          });
        },
        userSignIn(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                let data = {
                  name: this.signInForm.name,
                  account: this.signInForm.signAccount,
                  password: this.signInForm.signPassword,
                  repeatPassword: this.signInForm.repeatPassword,
                  email: this.signInForm.email,
                  phone: this.signInForm.phone,
                  teacher: this.signInForm.teacher,
                  type: this.signInForm.type,
                  state: 0
                };
                console.log(data);
                axios.post('/api/signIn',data).then((response) => {
                  if(response.data === 1){
                    this.$alert('注册成功!', '提示', {
                      confirmButtonText: '确定',
                      callback: action => {
                        location.reload();
                      }
                    });
                  }else{
                    this.$alert('注册失败,请重新注册。', '提示', {
                      confirmButtonText: '确定',
                      callback: action => {
                        location.reload();
                      }
                    });
                  }
                });
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          }
      }
    }
</script>
<style lang="less">
  html,body,#app{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  .mod-login{
    display: flex;
    width: 100%;
    height: 100%;
    background: #0099cc;
    background-size: 100%;
    .box-card{
      width: 30%;
      min-width: 400px;
      margin: auto;
      .logo{
        display: inline-block;
        width: 50px;
        height: 50px;
        margin-bottom: -18px;
        background: url(../resource/img/logo.jpg);
        background-size: 100%;
      }
      .title{
        display: inline-block;
        font-size: 20px;
        font-family: 'KaiTi','SimSun';
      }
      .account,.password{
        margin: 0 0 15px 0;
      }
      .login-btn{
        width: 100%;
      }
      .sign-in{
        font-size: 14px;
        float: right;
      }
    }
    @media screen and (max-width: 500px) {
      .box-card {
          width: 100%;
      }
    }
  }
</style>
