<template>
  <div class="mod-asset-apply">
    <h3>固定资产入库申请</h3>
    <el-button class="apply-btn" type="primary" @click="assetApply = true">创建申请</el-button>
    <el-dialog title="固定资产入库申请" v-model="assetApply">
      <el-form>
        <el-form-item>
          <el-input v-model="band" auto-complete="off" placeholder="设备厂商"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="name" auto-complete="off" placeholder="设备名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="model" auto-complete="off" placeholder="设备型号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="cost" auto-complete="off" placeholder="金额"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="projectId" auto-complete="off" placeholder="项目编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="teacher" auto-complete="off" placeholder="审核教师工号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assetApply = false">取 消</el-button>
        <el-button type="primary" @click="sendApply">确 定</el-button>
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
const applyState = ['已拒绝','待教师审核','待财务管理员审核','待上传票据及信息','待财务管理员二审','审核通过'];
export default {
  data(){
    return {
      band: '',
      name: '',
      cost: '',
      projectId: '',
      model: '',
      teacher: '',
      assetApply: false,
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
      });
    },
    sendApply(){
      let data = {
        band: this.band,
        cost: this.cost,
        name: this.name,
        model: this.model,
        teacher: this.teacher,
        projectId: this.projectId
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
          axios.post('/api/submitassetInfos',data).then((response) => {
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
}
</style>
