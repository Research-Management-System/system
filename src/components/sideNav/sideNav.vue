<template>
    <div class="side-nav">
      <el-col v-if="this.userInfo.type === 1">
        <el-menu default-active="1-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>项目过程管理</template>
              <a href="/#/"><el-menu-item index="1-1">查看/加入项目</el-menu-item></a>
              <a href="/#/projectApply"><el-menu-item index="1-2">查看申请状态</el-menu-item></a>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>科研成果管理</template>
            <a href="/#/gthesiseApply"><el-menu-item index="2-1">毕业论文申请</el-menu-item></a>
            <a href="/#/sthesiseApply"><el-menu-item index="2-2">小论文申请</el-menu-item></a>
            <a href="/#/patentApply"><el-menu-item index="2-3">专利申请</el-menu-item></a>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>财务管理</template>
            <a href="/#/apply"><el-menu-item index="3-1">不入库报账申请</el-menu-item></a>
            <a href="/#/apply"><el-menu-item index="3-2">固定资产入库申请</el-menu-item></a>
            <a href="/#/apply"><el-menu-item index="3-3">固定资产查看</el-menu-item></a>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col v-else>
        <el-menu default-active="1-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>项目过程管理</template>
              <a href="/#/"><el-menu-item index="1-1">查看/申请项目</el-menu-item></a>
              <a href="/#/projectApply"><el-menu-item index="1-2">处理项目申请</el-menu-item></a>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>科研成果管理</template>
            <a href="/#/gthesiseApply"><el-menu-item index="2-1">毕业论文申请</el-menu-item></a>
            <a href="/#/sthesiseApply"><el-menu-item index="2-2">小论文申请</el-menu-item></a>
            <a href="/#/patentApply"><el-menu-item index="2-3">专利申请</el-menu-item></a>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>财务管理</template>
            <a href="/#/apply"><el-menu-item index="3-1">不入库报账申请</el-menu-item></a>
            <a href="/#/apply"><el-menu-item index="3-2">固定资产入库申请</el-menu-item></a>
            <a href="/#/apply"><el-menu-item index="3-3">固定资产查看</el-menu-item></a>
          </el-submenu>
        </el-menu>
      </el-col>
    </div>
</template>

<script>
    // import axios from 'axios';
    export default {
      props: ['userInfo'],
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
    box-sizing: border-box;
    height: 100%;
    margin-top: -117px;
    padding-top: 117px;
    .el-col{
      height: 100%;
      .el-menu{
        height: 100%;
      }
    }
    a{
      text-decoration: none;
    }
  }
</style>
