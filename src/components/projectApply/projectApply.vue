<template>
  <div class="mod-apply">
    <h3 v-if="this.data.userInfo.type === 1">我的申请状态</h3>
    <h3 v-else>项目申请查看</h3>
    <div class="apply-table">
      <el-table :data="applys" border style="width: 100%">
        <el-table-column prop="account" label="申请人">
        </el-table-column>
        <el-table-column prop="projectId" label="项目编号">
        </el-table-column>
        <el-table-column prop="teacher" label="负责教师">
        </el-table-column>
        <el-table-column prop="state" label="申请状态">
        </el-table-column>
        <el-table-column prop="time" label="申请时间">
        </el-table-column>
        <el-table-column v-if="this.data.userInfo.type != 1" label="操作">
          <template scope="applys">
            <el-button
              size="small"
              @click="handleApply(applys.row,1)">同意</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleApply(applys.row,2)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="applyLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const applyState = ['待审核','已同意','已拒绝'];
export default {
  data(){
    return {
      "applys": this.data.projectApply.slice(0,10),
      "applyLength": this.data.projectApply.length
    };
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.applys = this.data.projectApply.slice(((currentPage-1)*10),currentPage*10);
      this.applys.forEach(item => {
        item.state = applyState[item.state];
      })
    },
    handleApply(obj,state) {
      let data = {
        account: obj.account,
        id: obj.projectId,
        state: state
      };
      console.log(data);
      if(state === 1){
        this.$confirm('确认同意申请?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.post('/api/checkJoinProject',data).then((response) => {
              console.log(response.data);
              if(response.data === 1){
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
      }else{
        this.$confirm('确认拒绝申请?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.post('/api/checkJoinProject',data).then((response) => {
              console.log(response.data);
              if(response.data === 1){
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
  created(){
    this.applys.forEach(item => {
      item.state = applyState[item.state];
    });
  }
}
</script>

<style lang="less">
.mod-apply{
  .apply-table{
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
  .notice{
    display: block;
    margin-bottom: 10px;
    color: red;
    font-size: 12px;
  }
}
</style>
