<template>
  <div class="mod-login">
    <el-card class="box-card">
      <span class="logo"></span><h4 class="title">科研项目过程管理系统</h4>
      <el-input class="account" v-model="account" placeholder="学号"></el-input>
      <el-input class="password" type="password" v-model="password" placeholder="密码"></el-input>
      <el-button type="primary" class="login-btn" @click="login">登录</el-button>
      <el-button type="text" class="sign-in" @click="signIn = true">注册</el-button>
    </el-card>
    <el-dialog title="用户注册" v-model="signIn">
      <el-form class="form-box">
        <el-form-item>
          <el-input placeholder="姓名" type="name" auto-complete="off" v-model="name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="学/工号" type="account" auto-complete="off" v-model="signAccount"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="密码" type="password" auto-complete="off" v-model="signPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="重复密码" type="password" auto-complete="off" v-model="repeatPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="邮箱" type="email" auto-complete="off" v-model="email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="电话" type="phone" auto-complete="off" v-model="phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="signIn = false">取 消</el-button>
        <el-button type="primary" @click="userSignIn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import axios from 'axios';

    export default {
      data() {
          return {
              account : '',
              password : '',
              name: '',
              signAccount: '',
              signPassword: '',
              repeatPassword: '',
              email: '',
              phone: '',
              signIn: false
          }
      },
      methods:{
        login() {
          let data = {
            account : this.account,
            password : this.password
          };
          axios.post('/api/login/getAccount',data)
            .then((response) => {
              // 响应成功回调
              if(response.data === 0 || response.data === 1){
                this.$alert('账号/密码错误!', '提示', {
                  confirmButtonText: '确定'
                });
              }else{
                this.$emit("login",response.data[0]);
              }
          });
        },
        userSignIn() {
          console.log(this.name);
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
