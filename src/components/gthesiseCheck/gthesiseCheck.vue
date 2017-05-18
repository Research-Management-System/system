<template>
  <div class="mod-gthesise-check">
    <h3>毕业论文申请审核</h3>
    <div class="gthesise-table">
      <el-table :data="gthesises" border style="width: 100%">
        <el-table-column prop="id" label="论文编号">
        </el-table-column>
        <el-table-column prop="title" label="论文标题">
        </el-table-column>
        <el-table-column prop="teacher" label="负责教师">
        </el-table-column>
        <el-table-column prop="applyState" label="申请状态">
        </el-table-column>
        <el-table-column label="审核">
          <template scope="applys">
            <el-button
              size="small"
              @click="handleApply(applys.row,2)">同意</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleApply(applys.row,0)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="gthesiseLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const applyState = ['已拒绝','待教师审核','待上传最终版','待科研管理审核','审核通过'];
export default {
  data(){
    return {
      title: '',
      authors: '',
      teacher: '',
      editor: '',
      gthesises: this.data.gthesises.slice(0,10),
      gthesiseLength: this.data.gthesises.length
    }
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.gthesises = this.data.gthesises.slice(((currentPage-1)*10),currentPage*10);
      this.gthesises.forEach(item => {
        item.applyState = applyState[item.state];
      });
    },
    handleApply(obj,state) {
      let data = {
        id: obj.id,
        projectId: obj.projectId,
        state: state
      };
      console.log(data);
      if(state === 2){
        this.$confirm('确认同意申请?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.post('/api/checkGthesisApply',data).then((response) => {
              console.log(response.data);
              if(response.data == 1){
                location.reload();
              }else{
                this.$alert('操作失败l', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    location.reload();
                  }
                });
              }
            });
          });
      }else{
        this.$confirm('确认拒绝申请?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.post('/api/checkGthesisApply',data).then((response) => {
              console.log(response.data);
              if(response.data == 1){
                location.reload();
              }else{
                this.$alert('操作失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    location.reload();
                  }
                });
              }
            });
          });
      }
    }
  },
  created() {
    this.gthesises.forEach(item => {
      item.applyState = (applyState[item.state]);
    });
  }
}
</script>

<style lang="less">
.mod-gthesise-check{
  .gthesise-table{
    .cell{
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .page-change{
      float: right;
      margin-top: 20px;
    }
    .el-table__body-wrapper{
      overflow: hidden;
    }
  }
}
</style>
