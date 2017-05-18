<template>
  <div class="mod-sthesise-check">
    <h3>小论文申请审核</h3>
    <div class="sthesise-table">
      <el-table :data="sthesises" border style="width: 100%">
        <el-table-column prop="id" label="论文编号">
        </el-table-column>
        <el-table-column prop="title" label="论文标题">
        </el-table-column>
        <el-table-column prop="teacher" label="负责教师">
        </el-table-column>
        <el-table-column prop="applyState" label="申请状态">
        </el-table-column>
        <el-table-column v-if="this.type ===2" label="审核">
          <!-- 教师审核 -->
          <template scope="applys">
              <el-button
                size="small"
                :disabled="applys.row.state != 0 && applys.row.state != 1"
                @click="handleApply(applys.row,2)">同意</el-button>
              <el-button
                size="small"
                type="danger"
                :disabled="applys.row.state != 0 && applys.row.state != 1"
                @click="handleApply(applys.row,0)">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="this.type === 4" label="审核">
          <!-- 教师审核 -->
          <template scope="applys">
            <!-- 财务管理员审核 -->
              <el-button v-if="applys.row.state == 2"
                size="small"
                @click="assignAccount(applys.row)">同意并分配账号</el-button>
              <el-button v-else
                size="small"
                :disabled="applys.row.state != 5"
                @click="handleApply(applys.row,2)">同意</el-button>
              <el-button
                size="small"
                type="danger"
                :disabled="applys.row.state != 5 && applys.row.state != 2"
                @click="handleApply(applys.row,0)">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="this.type === 3" label="审核">
          <template scope="applys">
              <el-button
                size="small"
                :disabled="applys.row.state != 4"
                @click="handleApply(applys.row,2)">同意</el-button>
              <el-button
                size="small"
                type="danger"
                :disabled="applys.row.state != 4"
                @click="handleApply(applys.row,0)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="sthesiseLength" :page-size="10">
      </el-pagination>
    </div>
    <el-dialog title="分配账号" v-model="accountAssign">
      <el-form>
        <el-form-item>
          <el-input v-model="account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="accountAssign = false">取 消</el-button>
        <el-button type="primary" @click="sendAccount">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
const applyState = ['已拒绝','待教师审核','待财物管理员分配账号','待上传最终pdf','待科研管理员审核','待财务管理员审核','审核通过'];
export default {
  data(){
    return {
      type: this.data.userInfo.type,
      title: '',
      authors: '',
      teacher: '',
      account: '',
      currentData: {},
      accountAssign: false,
      sthesises: this.data.sthesises.slice(0,10),
      sthesiseLength: this.data.sthesises.length
    }
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.sthesises = this.data.sthesises.slice(((currentPage-1)*10),currentPage*10);
      this.sthesises.forEach(item => {
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
            if(this.data.userInfo.type === 3){
              data.state = 5;
            }else if(this.data.userInfo.type === 4){
              data.state = 6;
            }
            axios.post('/api/checksthesisApply',data).then((response) => {
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
      }else{
        this.$confirm('确认拒绝申请?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.post('/api/checksthesisApply',data).then((response) => {
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
    },
    assignAccount(obj){
      this.accountAssign = true;
      this.currentData = obj;
    },
    sendAccount(){
      let data = {
        id: this.currentData.id,
        account: this.account,
        choice: 3
      }
      console.log(data);
      axios.post('/api/checkAccount',data).then((response) => {
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
      })
    }
  },
  created() {
    this.sthesises.forEach(item => {
      item.applyState = (applyState[item.state]);
    });
  }
}
</script>

<style lang="less">
.mod-sthesise-check{
  .sthesise-table{
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
