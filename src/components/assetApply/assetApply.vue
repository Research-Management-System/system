<template>
  <div class="mod-asset-apply">
    <h3>固定资产入库申请</h3>
    <el-button class="apply-btn" type="primary" @click="assetApply = true">创建申请</el-button>
    <el-dialog title="固定资产入库申请" v-model="assetApply">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="band">
          <el-input v-model="form.band" auto-complete="off" placeholder="设备厂商"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="设备名"></el-input>
        </el-form-item>
        <el-form-item prop="model">
          <el-input v-model="form.model" auto-complete="off" placeholder="设备型号"></el-input>
        </el-form-item>
        <el-form-item prop="cost">
          <el-input v-model="form.cost" auto-complete="off" placeholder="金额"></el-input>
        </el-form-item>
        <el-form-item prop="projectId">
          <el-input v-model="form.projectId" auto-complete="off" placeholder="项目编号"></el-input>
        </el-form-item>
        <el-form-item prop="teacher">
          <el-input v-model="form.teacher" auto-complete="off" placeholder="审核教师工号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assetApply = false">取 消</el-button>
        <el-button type="primary" @click="sendApply('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设备详情" class="device-details" v-model="showDetails">
      <el-form>
        <el-form-item label="所属项目">
          <el-input v-model="currentObj.projectId" auto-complete="off" :disabled="currentObj.state > 4"></el-input>
        </el-form-item>
        <el-form-item label="设备名">
          <el-input v-model="currentObj.name" auto-complete="off" :disabled="currentObj.state > 4"></el-input>
        </el-form-item>
        <el-form-item label="设备厂商">
          <el-input v-model="currentObj.band" auto-complete="off" :disabled="currentObj.state > 4"></el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-input v-model="currentObj.model" auto-complete="off" :disabled="currentObj.state > 4"></el-input>
        </el-form-item>
        <el-form-item label="使用人">
          <el-input v-model="currentObj.user" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="currentObj.deviceId" auto-complete="off" :disabled="currentObj.state > 4"></el-input>
        </el-form-item>
        <el-form-item label="分配账号">
          <el-input v-model="currentObj.account" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item  label="报销金额">
          <el-input v-model="currentObj.cost" auto-complete="off" :disabled="currentObj.state > 4"></el-input>
        </el-form-item>
        <el-form-item label="购买时间">
          <!-- <el-input v-model="this.currentObj.time" auto-complete="off" :disabled="this.currentObj.state > 5"></el-input> -->
          <template>
            <div class="block">
              <el-date-picker :disabled="currentObj.state > 4"
                v-model="currentObj.purchaseDate"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions0">
              </el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="设备状态">
          <!-- <el-input v-model="this.currentObj.deviceState" auto-complete="off" :disabled="this.currentObj.state > 5"></el-input> -->
          <el-select v-model="currentObj.deviceState" placeholder="请选择设备状态"  :disabled="currentObj.state > 4">
            <el-option label="可使用" value="可使用"></el-option>
            <el-option label="待维修" value="待维修"></el-option>
            <el-option label="已损坏" value="已损坏"></el-option>
          </el-select>
          {{currentObj.deviceState}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDetails = false">取 消</el-button>
        <el-button type="primary" @click="changeDeviceInfo">确 定</el-button>
      </div>
    </el-dialog>
    <h3>我的申请</h3>
    <div class="asset-table">
      <el-table :data="assets" border style="width: 100%">
        <el-table-column prop="projectId" label="所属项目编号">
        </el-table-column>
        <el-table-column prop="name" label="设备名">
        </el-table-column>
        <el-table-column prop="cost" label="金额">
        </el-table-column>
        <el-table-column prop="account" label="分配报账账号">
        </el-table-column>
        <el-table-column prop="applyState" label="申请状态">
        </el-table-column>
        <el-table-column label="查看详细信息">
          <template scope="asset">
            <el-button size="small" @click="showDetail(asset.row)">
              修改设备详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="上传票据">
            <template scope="asset">
              <form action="/api/upload" method="post" id="finalUpload" enctype='multipart/form-data'>
                  <input type="file" name ="inputFile" id="uploadFinalFile" />
              </form>
              <el-button
                size="small"
                :disabled="asset.row.state != 3"
                @click="inputClick">选择文件</el-button>
              <el-button
                size="small"
                :disabled="asset.row.state != 3"
                @click="uploadFinalFile(asset.row)">上传</el-button>
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
const applyState = ['已拒绝','待教师审核','待财务管理员审核','待上传票据及信息','待固定资产管理员审核','待财务管理员二审','审核通过'];
export default {
  data(){
    function validateName(rule, value, callback){
      if (value === '') {
        callback(new Error('请输入专利名称'));
      } else {
        callback();
      }
    };
    function validateProjectId(rule, value, callback){
      if (value === '') {
        callback(new Error('请输入所属项目ID'));
      } else if (!(/^[0-9]+$/).test(value)) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    function validateTeacher(rule, value, callback){
      if (value === '') {
        callback(new Error('请输入教师工号'));
      } else if (!(/^(\d){6}$/).test(value)) {
        callback(new Error("工号格式错误"));
      } else {
        callback();
      }
    };
    function validateCost(rule, value, callback){
      if (value === '') {
        callback(new Error('请输入报账金额'));
      } else if (!(/^[0-9]+$/).test(value)) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    return {
      form: {
        band: '',
        name: '',
        cost: '',
        projectId: '',
        model: '',
        teacher: ''
      },
      currentObj: {},
      assetApply: false,
      showDetails: false,
      assets: this.data.assets.slice(0,10),
      assetLength: this.data.assets.length,
      pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
      },
      rules: {
        name:[
            { validator: validateName, trigger: 'blur' }
          ],
        projectId:[
            { validator: validateProjectId, trigger: 'blur' }
          ],
        band:[
            { validator: validateName, trigger: 'blur' }
          ],
        model:[
            { validator: validateName, trigger: 'blur' }
          ],
        teacher:[
            { validator: validateTeacher, trigger: 'blur' }
          ],
        cost: [
          { validator: validateCost, trigger: 'blur' }
        ]
      }
    }
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.assets = this.data.assets.slice(((currentPage-1)*10),currentPage*10);
      this.assets.forEach(item => {
        item.applyState = applyState[item.state];
      });
    },
    sendApply(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              band: this.form.band,
              cost: this.form.cost,
              name: this.form.name,
              model: this.form.model,
              teacher: this.form.teacher,
              projectId: this.form.projectId
            };
            axios.post('/api/assetApply',data).then((response) => {
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    showDetail(obj){
      this.currentObj = obj;
      this.showDetails = true;
      console.log(this.currentObj);
    },
    changeDeviceInfo(){
      let data = {
        projectId: this.currentObj.projectId||'',
        name: this.currentObj.name||'',
        band: this.currentObj.band||'',
        model: this.currentObj.model||'',
        deviceId: this.currentObj.deviceId ||'',
        deviceState: this.currentObj.deviceState ||'',
        cost: this.currentObj.cost||0,
        purchaseDate: this.currentObj.purchaseDate ||'',
        id: this.currentObj.id
      };
      console.log(data);
      axios.post('/api/submitAssetInfo',data).then((response) => {
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
    },
    inputClick(){
      let fileDom = document.getElementById("uploadFinalFile");
      fileDom.click();
    },
    uploadFinalFile(obj){
      let data = {
        id: obj.id
      };
      console.log(data);
      let fileDom = document.getElementById("uploadFinalFile");
      let file = fileDom.files[0];
      if(file){
        let formdata = new FormData();
        formdata.append('inputFile',file);
        axios({
            url:'/api/upload',
            method:'post',
            data:formdata,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((res)=>{
          data.path = res.data.filePath;
          axios.post('/api/submitassetFile',data).then((response) => {
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
        this.$alert('请先选择文件', '提示', {
          confirmButtonText: '确定'
        });
      }
    }
  },
  created() {
    this.assets.forEach(item => {
      item.applyState = applyState[item.state];
    });
  }
}
</script>

<style lang="less">
.mod-asset-apply{
  .apply-btn{
    margin-bottom: 5px;
  }
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
  .device-details{
    .el-form-item{
      margin-bottom: 10px;
    }
  }
}
</style>
