<template>
  <div class="mod-patent-check">
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
    <h3>专利申请审核</h3>
    <div class="patent-table">
      <el-table :data="patents" border style="width: 100%">
        <el-table-column prop="projectId" label="专利编号">
        </el-table-column>
        <el-table-column prop="name" label="专利名称">
        </el-table-column>
        <el-table-column prop="inventor" label="发明人">
        </el-table-column>
        <el-table-column prop="applyState" label="申请状态">
        </el-table-column>
        <el-table-column label="受理通知书/专利证书">
          <template scope="patent">
            <el-button size="small">
              <a :href="'/api/downloadFiles?id=' + patent.row.id +'&choice=3'">下载</a>
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
                :disabled="applys.row.state != 5"
                @click="handleApply(applys.row,6)">同意</el-button>
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
                @click="handleApply(applys.row,5)">同意</el-button>
              <el-button
                size="small"
                type="danger"
                :disabled="applys.row.state != 4"
                @click="handleApply(applys.row,0)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="patentLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const applyState = ['已拒绝','待上传受理通知书','待财务管理员审核','待上传证书及票据','待科研管理员审核','待财务管理员二审','审核通过'];
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
      patents: this.data.patents.slice(0,10),
      patentLength: this.data.patents.length
    }
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.patents = this.data.patents.slice(((currentPage-1)*10),currentPage*10);
      this.patents.forEach(item => {
        item.applyState = applyState[item.state];
      });
    },
    sendApply(){
      let data = {
        id: this.currentObj.id,
        account: this.account,
        choice: 4
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
            if(this.type === 3){//科研成果管理员审核
              data.choice = 3;
              axios.post('/api/checkAchievements',data).then((response) => {
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
              data.choice = 4;
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
            }
          });
      }else{
        this.$confirm('确认同意申请?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(this.type === 3){//科研成果管理员审核
              data.choice = 3;
              axios.post('/api/checkAchievements',data).then((response) => {
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
              data.choice = 4;
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
    this.patents.forEach(item => {
      item.applyState = applyState[item.state];
    });
  }
}
</script>

<style lang="less">
.mod-patent-check{
  .patent-table{
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
