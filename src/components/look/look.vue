<template>
  <div class="mod-look">
    <h3>项目列表</h3>
    <div class="project-table">
      <el-table :data="projects" border style="width: 100%">
        <el-table-column prop="name" label="项目名称" width="180">
        </el-table-column>
        <el-table-column prop="teachers" label="负责教师" width="180">
        </el-table-column>
        <el-table-column prop="students" label="学生">
        </el-table-column>
      </el-table>
      <el-pagination @current-change="pageChange" layout="prev, pager, next" :total="projectLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
let projectArr = [{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },
  {
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },
  {
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  },{
    name:"科研项目过程管理系统",
    teachers: ["哈哈哈","啦啦啦"],
    students: ["lzk","mjr"],
    time: new Date()
  }];
let projectLength = projectArr.length;
console.log(length);
export default {
  data(){
    return {
      "projects": projectArr.slice(0,10),
      "projectLength": projectLength
    };
  },
  methods: {
    pageChange(currentPage){
      console.log(currentPage);
      this.projects = projectArr.slice(((currentPage-1)*10),currentPage*10);
    }
  }
}
</script>

<style lang="css">
</style>
