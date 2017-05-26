<template>
  <div class="mod-asset-check">
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
    <el-dialog title="设备详情" class="device-details" v-model="showDetails">
      <el-form>
        <el-form-item label="所属项目">
          {{this.currentObj.projectId}}
          <!-- <el-input v-model="this.currentObj.projectId" auto-complete="off" placeholder="设备名" disabled></el-input> -->
        </el-form-item>
        <el-form-item label="设备名">
          {{this.currentObj.name}}
          <!-- <el-input v-model="this.currentObj.name" auto-complete="off" placeholder="设备名" disabled></el-input> -->
        </el-form-item>
        <el-form-item label="设备厂商">
          {{this.currentObj.band}}
          <!-- <el-input v-model="this.currentObj.band" auto-complete="off" disabled></el-input> -->
        </el-form-item>
        <el-form-item label="设备型号">
          {{this.currentObj.model}}
          <!-- <el-input v-model="this.currentObj.model" auto-complete="off" disabled></el-input> -->
        </el-form-item>
        <el-form-item label="使用人">
          {{this.currentObj.user}}
          <!-- <el-input v-model="this.currentObj.user" auto-complete="off" disabled></el-input> -->
        </el-form-item>
        <el-form-item label="设备编号">
          {{this.currentObj.deviceId || "未填写"}}
          <!-- <el-input v-model="this.currentObj.deviceId" auto-complete="off" disabled></el-input> -->
        </el-form-item>
        <el-form-item label="设备状态">
          {{this.currentObj.deviceState || "未填写"}}
          <!-- <el-input v-model="this.currentObj.deviceState" auto-complete="off" disabled></el-input> -->
        </el-form-item>
        <el-form-item label="分配账号">
          {{this.currentObj.account || "未分配"}}
          <!-- <el-input v-model="this.currentObj.account" auto-complete="off" disabled></el-input> -->
        </el-form-item>
        <el-form-item  label="报销金额">
          {{this.currentObj.cost}}
          <!-- <el-input v-model="this.currentObj.cost" auto-complete="off" disabled></el-input> -->
        </el-form-item>
        <el-form-item label="购买时间">
          {{this.currentObj.purchaseDate || "未填写"}}
          <!-- <el-input v-model="this.currentObj.time" auto-complete="off" disabled></el-input> -->
        </el-form-item>
      </el-form>
    </el-dialog>
    <h3>固定资产入库申请审核</h3>
    <div class="asset-table">
      <el-table :data="assets" border style="width: 100%">
        <el-table-column prop="projectId" label="所属项目编号">
        </el-table-column>
        <el-table-column prop="name" label="设备名">
        </el-table-column>
        <el-table-column prop="cost" label="报账金额">
        </el-table-column>
        <el-table-column prop="time" label="申请时间">
        </el-table-column>
        <el-table-column prop="applyState" label="申请状态">
        </el-table-column>
        <el-table-column label="下载票据" v-if="this.type === 4">
          <template scope="asset">
            <el-button size="small" :disabled="asset.row.state < 4">
              <a :href="'/api/downloadFiles?id=' + asset.row.id +'&choice=1'" v-if="asset.row.state >= 4">下载</a>
              <span v-else>下载</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="查看详细信息">
          <template scope="asset">
            <el-button size="small" @click="showDetail(asset.row)">
              查看设备详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="this.type === 4" label="审核">
          <template scope="applys">
            <!-- 财务管理员审核 -->
              <el-button v-if="applys.row.state == 2"
                size="small"
                @click="assignAccount(applys.row)">分配账号</el-button>
              <el-button v-else
                size="small"
                :disabled="applys.row.state != 4"
                @click="handleApply(applys.row,6)">同意</el-button>
              <el-button
                size="small"
                type="danger"
                :disabled="applys.row.state != 4 && applys.row.state != 2"
                @click="handleApply(applys.row,0)">拒绝</el-button>
          </template>
        </el-table-column>
        <!-- 固定资产管理员审核 -->
        <el-table-column v-if="this.type === 5" label="审核">
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
        <!-- 教师审核 -->
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
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="assetLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const applyState = ['已拒绝','待教师审核','待财务管理员审核','待上传票据','待固定资产管理员审核','待财务管理员二审','审核通过'];
export default {
  data(){
    return {
      type: this.data.userInfo.type,
      description: '',
      currentObj: {},
      account: '',
      accountAssign: false,
      showDetails: false,
      assets: this.data.assets.slice(0,10),
      assetLength: this.data.assets.length
    }
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.assets = this.data.assets.slice(((currentPage-1)*10),currentPage*10);
      this.assets.forEach(item => {
        item.applyState = applyState[item.state];
        item.time = item.time.slice(0,10);
      });
    },
    sendApply(){
      let data = {
        id: this.currentObj.id,
        account: this.account,
        choice: 1
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
      this.currentObj = obj;
      this.accountAssign = true;
    },
    showDetail(obj){
      this.currentObj = obj;
      this.showDetails = true;
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
              axios.post('/api/checkassetApply',data).then((response) => {
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
              data.choice = 1;
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
              axios.post('/api/checkassetApply',data).then((response) => {
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
            }else if(this.type === 4){//财务管理员二审
              data.choice = 1;
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
            }else{//固定资产管理员审核
              axios.post('/api/checkAsset',data).then((response) => {
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
    this.assets.forEach(item => {
      item.applyState = applyState[item.state];
      item.time = item.time.slice(0,10);
    });
  }
}
</script>

<style lang="less">
.mod-asset-check{
  .asset-table{
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
  .device-details{
    .el-dialog--small{
      width: 20%;
      .el-form-item__label{
        font-weight: bold;
      }
    }
  }
}
</style>
