<template>
    <div class="side-nav">
      <el-col>
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>项目过程管理</template>
              <a href="/#/apply"><el-menu-item index="1-1">申请项目</el-menu-item></a>
              <a href="/#"><el-menu-item index="1-2">查看项目</el-menu-item></a>
          </el-submenu>
          <el-menu-item index="2"><i class="el-icon-menu"></i>科研成果管理</el-menu-item>
          <el-menu-item index="3"><i class="el-icon-setting"></i>财务管理</el-menu-item>
        </el-menu>
      </el-col>
    </div>
</template>

<script>
    // import axios from 'axios';
    export default {
      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        }
      }
    }
</script>
<style lang="less">
  .side-nav{
    height: 100%;
    .el-col,.el-menu{
      height: 100%;
    }
    a{
      text-decoration: none;
    }
  }
</style>
