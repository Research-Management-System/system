<template>
  <div class="mod-index">
    <div class="top-wrapper">
      <span class="logo"></span><span class="title">科研项目过程管理系统</span>
    </div>
    <!-- <div class="side-wrapper">
      <userInfo :userInfo="userInfo"></userInfo>
      <sideNav></sideNav>
    </div>
    <div class="content-wrapper">
      <router-link to="/"></router-link>
      <router-link to="/apply"></router-link>
      <router-view></router-view>
    </div> -->
    <el-row class="mid-wrapper">
      <el-col class="side" :span="4">
        <userInfo :userInfo="userInfo"></userInfo>
        <sideNav></sideNav>
      </el-col>
      <el-col class="content" :span="18">
        <router-link to="/"></router-link>
        <router-link to="/apply"></router-link>
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import axios from 'axios';
    import sideNav from './sideNav/sideNav.vue';
    import userInfo from './userInfo/userInfo.vue';

    export default {
      props: ['userInfo'],
      components: {
        sideNav: sideNav,
        userInfo: userInfo
      }
    }
</script>
<style lang="less">
  .mod-index{
    height: 100%;
    .top-wrapper{
      width: 100%;
      height: 50px;
      min-width: 900px;
      background: #1F2D3D;
      .logo{
        display: inline-block;
        vertical-align: middle;
        width: 50px;
        height: 50px;
        background: url(../resource/img/logo.png);
        background-size: 100%;
      }
      .title{
        vertical-align: middle;
        height: 50px;
        font-size: 20px;
        font-family: 'KaiTi','SimSun';
        color: #fff;
      }
    }
    .mid-wrapper{
      width: 100%;
      height: 100%;
      min-width: 900px;
      margin-top: -50px;
      padding-top: 50px;
      .side{
        height: 100%;
        min-width: 180px;
      }
      .content{
        margin: 20px;
        min-width: 500px;
      }
    }
    .space{
      visibility: hidden;
    }
  }
</style>
