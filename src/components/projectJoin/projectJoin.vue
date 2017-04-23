<template>
  <div class="mod-look">
    <h3>查看/加入项目</h3>
    <div class="project-join">
      <el-form label-width="80px" class="join-form">
        <el-form-item label="项目编号">
          <el-input v-model="joinProjectId"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="join-btn" @click="joinProject">申请加入</el-button>
    </div>
    <div class="project-table">
      <el-table :data="projects" border style="width: 100%">
        <el-table-column prop="id" label="项目编号">
        </el-table-column>
        <el-table-column prop="name" label="项目名称">
        </el-table-column>
        <el-table-column prop="teacher" label="负责教师">
        </el-table-column>
        <el-table-column prop="students" label="学生学号">
        </el-table-column>
        <el-table-column prop="description" label="项目描述">
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="projectLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      // "projects": projectArr.slice(0,10),
      "projects": this.data.projects.slice(0,10),
      "projectLength": this.data.projects.length,
      "joinProjectId": ''
    };
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      // console.log(projectList);
      // this.projectLength = projectList.length;
      this.projects = this.data.projects.slice(((currentPage-1)*10),currentPage*10);
    },
    joinProject(){
      console.log(this.joinProjectId);
    }
  }
}
</script>

<style lang="less">
.mod-look{
  .project-table{
    .cell{
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .page-change{
      float: right;
      margin-top: 20px;
    }
  }
  .project-join{
    margin: 20px 0 ;
    .join-form{
      float: left;
      width: 300px;
    }
    .join-btn{
      float:left;
      margin-left: 10px;
    }
  }
}
</style>
