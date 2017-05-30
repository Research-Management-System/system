<template>
  <div class="mod-check-sign">
    <h3>教师注册申请列表</h3>
    <div class="sign-table">
      <el-table :data="signs" border style="width: 100%">
        <el-table-column prop="account" label="学号">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="phone" label="电话">
        </el-table-column>
        <el-table-column prop="time" label="申请时间">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="signs">
            <el-button
              size="small"
              @click="handleSignIn(signs.row)">确认激活</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="signLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data(){
    return {
      "signs": this.data.signInApply.slice(0,10),
      "signLength": this.data.signInApply.length
    };
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.applys = this.data.projectApply.slice(((currentPage-1)*10),currentPage*10);
    },
    handleSignIn(obj){
      let data = {
        account: obj.account
      };
      this.$confirm('确认激活?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('/api/activeUser',data).then((response) => {
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
}
</script>

<style lang="less">
.mod-check-sign{
  .sign-table{
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
}
</style>
