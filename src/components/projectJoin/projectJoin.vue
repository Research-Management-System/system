<template>
  <div class="mod-look">
    <h3 v-if="this.data.userInfo.type ===1">查看/加入项目</h3>
    <h3 v-else>查看/创建项目</h3>
    <div v-if="this.data.userInfo.type ===1" class="project-join">
      <el-form label-width="80px" class="join-form">
        <el-form-item label="项目编号">
          <el-input v-model="joinProjectId"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="join-btn" @click="joinProject">申请加入</el-button>
    </div>
    <div v-else class="project-create">
      <el-button type="primary" class="create-btn" @click="createProject = true">创建新项目</el-button>
      <el-button type="primary" class="group-btn" @click="createGroup = true">创建项目组</el-button>
    </div>
    <el-dialog v-if="this.data.userInfo.type !=1" title="新建项目" v-model="createProject">
      <el-form class="form-box">
        <el-form-item>
          <el-input placeholder="项目名称" type="text" auto-complete="off" v-model="name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="负责教师工号" type="text" auto-complete="off" v-model="teacher"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="projectG" placeholder="所属项目组">
            <el-option v-for="item in this.data.projectGs" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="使用账号" type="text" auto-complete="off" v-model="account"></el-input>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input type="textarea" v-model="description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createProject = false">取消</el-button>
        <el-button type="primary" @click="projectCreate">创建</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="this.data.userInfo.type !=1" title="新建项目组" v-model="createGroup">
      <el-form class="form-box">
        <el-form-item>
          <el-input placeholder="项目名称" type="text" auto-complete="off" v-model="groupName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="负责教师工号" type="text" auto-complete="off" v-model="caption"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createGroup = false">取消</el-button>
        <el-button type="primary" @click="groupCreate">创建</el-button>
      </div>
    </el-dialog>
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
import axios from 'axios';
export default {
  data(){
    return {
      // "projects": projectArr.slice(0,10),
      name: '',
      teacher: '',
      account: '',
      projectG: '',
      description: '',
      groupName: '',
      caption: '',
      projects: this.data.projects.slice(0,10),
      projectLength: this.data.projects.length,
      joinProjectId: '',
      createProject: false,
      createGroup: false
    };
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.projects = this.data.projects.slice(((currentPage-1)*10),currentPage*10);
    },
    joinProject(){
      let data = {
        account: this.data.userInfo.account,
        id: this.joinProjectId,
        state: 0
      };
      console.log(data);
      axios.post('/api/joinProject',data).then((response) => {
        if(response.data === 1){
          this.$alert('申请成功,请等待教师审核。', '提示', {
            confirmButtonText: '确定'
          });
        }else{
          this.$alert('申请失败,请重试。', '提示', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    projectCreate(){
      let data = {
        name: this.name,
        teacher: this.teacher,
        group: this.projectG,
        account: this.account,
        description: this.description
      };
      console.log(data);
      axios.post('/api/createProject',data).then((response) => {
        if(response.data === 1){
          this.$alert('创建成功。', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              location.reload();
            }
          });
        }else{
          this.$alert('创建失败,请重新创建。', '提示', {
            confirmButtonText: '确定'
          });
        }
      });
    },
    groupCreate(){
      let data = {
        name: this.groupName,
        caption: this.caption
      };
      console.log(data);
      axios.post('/api/createProjectGroup',data).then((response) => {
        if(response.data === 1){
          this.$alert('创建成功。', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              location.reload();
            }
          });
        }else{
          this.$alert('创建失败,请重新创建。', '提示', {
            confirmButtonText: '确定'
          });
        }
      });
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
  .project-create{
    margin: 20px 0;
  }
}
</style>
