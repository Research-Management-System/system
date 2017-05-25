<template>
  <div class="mod-render-check">
    <el-dialog title="分配账号" v-model="accountAssign">
      <el-form>
        <el-form-item>
          <el-input v-model="account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="accountAssign = false">取 消</el-button>
        <el-button type="primary" @click="sendApply">确 定</el-button>
      </div>
    </el-dialog>
    <h3>不入库报账申请审核</h3>
    <div class="render-table">
      <el-table :data="renders" border style="width: 100%">
        <el-table-column prop="projectId" label="所属项目编号">
        </el-table-column>
        <el-table-column prop="cost" label="报账金额">
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>
        <el-table-column prop="time" label="申请时间">
        </el-table-column>
        <el-table-column prop="applyState" label="申请状态">
        </el-table-column>
        <el-table-column label="下载票据" v-if="this.type === 4">
          <template scope="render">
            <el-button size="small" :disabled="render.row.state < 4">
              <a :href="'/api/downloadFiles?id=' + render.row.id +'&choice=2'" v-if="render.row.state >= 4">下载</a>
              <span v-else>下载</span>
            </el-button>
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
                :disabled="applys.row.state != 4"
                @click="handleApply(applys.row,5)">同意</el-button>
              <el-button
                size="small"
                type="danger"
                :disabled="applys.row.state != 4 && applys.row.state != 2"
                @click="handleApply(applys.row,0)">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="this.type === 2" label="审核">
          <template scope="applys">
              <el-button
                size="small"
                :disabled="applys.row.state != 1"
                @click="handleApply(applys.row,2)">同意</el-button>
              <el-button
                size="small"
                type="danger"
                :disabled="applys.row.state != 1"
                @click="handleApply(applys.row,0)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="renderLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const applyState = ['已拒绝','待教师审核','待财务管理员审核','待上传票据','待财务管理员二审','审核通过'];
export default {
  data(){
    return {
      type: this.data.userInfo.type,
      name: '',
      inventor: '',
      projectId: '',
      description: '',
      applicant: '',
      currentObj: {},
      account: '',
      accountAssign: false,
      renders: this.data.renders.slice(0,10),
      renderLength: this.data.renders.length
    }
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.renders = this.data.renders.slice(((currentPage-1)*10),currentPage*10);
      this.renders.forEach(item => {
        item.applyState = applyState[item.state];
        item.time = item.time.slice(0,10);
      });
    },
    sendApply(){
      let data = {
        id: this.currentObj.id,
        account: this.account,
        choice: 2
      };
      console.log(data);
      axios.post('/api/checkAccount',data).then((response) => {
        console.log(response.data);
        if(response.data === 1){
          this.$alert('分配成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              location.reload();
            }
          });
        }else{
          this.$alert('操作失败', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              location.reload();
            }
          });
        }
      });
    },
    assignAccount(obj){
      this.accountAssign = true;
      this.currentObj = obj;
    },
    handleApply(obj,state){
      let data = {
        id: obj.id,
        state: state
      };
      if(state === 0){
        this.$confirm('确认拒绝申请?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(this.type === 2){//教师审核
              axios.post('/api/checkRenderApply',data).then((response) => {
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
            }else{//财务管理员审核及二审
              data.choice = 2;
              axios.post('/api/checkMoney',data).then((response) => {
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
            }
          });
      }else{
        this.$confirm('确认同意申请?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(this.type === 2){//教师审核
              axios.post('/api/checkRenderApply',data).then((response) => {
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
            }else{//财务管理员二审
              data.choice = 2;
              axios.post('/api/checkMoney',data).then((response) => {
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
            }
          });
      }
    }
  },
  created() {
    this.renders.forEach(item => {
      item.applyState = applyState[item.state];
      item.time = item.time.slice(0,10);
    });
  }
}
</script>

<style lang="less">
.mod-render-check{
  .render-table{
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
  a{
    text-decoration: none;
    color: #000;
  }
}
</style>
