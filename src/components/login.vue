<template>
  <div class="mod-login">
    <el-card class="box-card">
      <span class="logo"></span><h4 class="title">科研项目过程管理系统</h4>
      <el-input class="account" v-model="account" placeholder="学号"></el-input>
      <el-input class="password" type="password" v-model="password" placeholder="密码"></el-input>
      <el-button type="primary" class="login-btn" @click="login">登录</el-button>
      <el-button type="text" class="login-forget">忘记密码?</el-button>
    </el-card>
  </div>
</template>

<script>
    import axios from 'axios';

    export default {
    data() {
        return {
            account : '',
            password : ''
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
              alert("用户名/密码错误");
            }else{
              this.$emit("login",response.data[0]);
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
      .login-forget{
        font-size: 12px;
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
