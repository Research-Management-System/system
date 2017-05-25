<template>
  <div class="mod-patent-apply">
    <h3>专利申请</h3>
    <el-button class="apply-btn" type="primary" @click="patentApply = true">创建申请</el-button>
    <el-dialog title="专利申请" v-model="patentApply">
      <el-form>
        <el-form-item>
          <el-input v-model="name" auto-complete="off" placeholder="专利名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="inventor" auto-complete="off" placeholder="发明人,多个发明人请用顿号分隔"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="applicant" auto-complete="off" placeholder="applicant"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="projectId" auto-complete="off" placeholder="项目id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="description" auto-complete="off" placeholder="专利描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="patentApply = false">取 消</el-button>
        <el-button type="primary" @click="sendApply">确 定</el-button>
      </div>
    </el-dialog>
    <h3>我的申请</h3>
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
        <el-table-column label="操作">
          <template scope="applys">
            <el-button size="small" @click="showDetails = true; currentObj = applys.row">
              查看并操作
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="patentLength" :page-size="10">
      </el-pagination>
    </div>
    <el-dialog title="申请信息查看" v-model="showDetails">
      <el-form>
        <el-form-item>
          <el-input v-model="currentObj.name" auto-complete="off" placeholder="专利名称" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="currentObj.inventor" auto-complete="off" placeholder="发明人" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="currentObj.applicant" auto-complete="off" placeholder="applicant" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="currentObj.projectId" auto-complete="off" placeholder="项目id" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="currentObj.description" auto-complete="off" placeholder="专利描述" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="currentObj.noticeId" auto-complete="off" placeholder="专利申请号" :disabled="currentObj.state!=1"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="currentObj.cost" auto-complete="off" placeholder="费用预算" :disabled="currentObj.state!=1"></el-input>
        </el-form-item>
        <el-form-item label="受理申请书上传" >
          <form action="/api/upload" method="post" id="fileUpload" enctype='multipart/form-data'>
              <input type="file" name ="inputFile" id="noticeFile" :disabled="currentObj.state!=1" />
          </form>
        </el-form-item>
        <el-form-item>
          <el-input v-model="currentObj.patentId" auto-complete="off" placeholder="专利号" :disabled="currentObj.state!=3"></el-input>
        </el-form-item>
        <el-form-item label="专利证书及票据上传" >
          <form action="/api/upload" method="post" id="fileUpload" enctype='multipart/form-data'>
              <input type="file" name ="inputFile" id="patentFile" :disabled="currentObj.state!=3" />
          </form>
        </el-form-item>
        <el-button
          size="small"
          :disabled="currentObj.state != 1"
          @click="uploadNoticeFile(currentObj)">上传受理通知书及申请号</el-button>
          <el-button
            size="small"
            :disabled="currentObj.state != 3"
            @click="uploadPatentFile(currentObj)">上传专利证书、专利号及票据</el-button>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDetails = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
const applyState = ['已拒绝','待上传受理通知书','待财务管理员审核','待上传证书及票据','待科研管理员审核','待财务管理员二审','审核通过'];
export default {
  data(){
    return {
      name: '',
      inventor: '',
      projectId: '',
      description: '',
      applicant: '',
      currentObj: {},
      patentApply: false,
      showDetails: false,
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
        name: this.name,
        inventor: this.inventor,
        projectId: this.projectId,
        applicant: this.applicant,
        description: this.description
      };
      console.log(data);
      axios.post('/api/patentApply',data).then((response) => {
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
    uploadNoticeFile(obj){
      let data = {
        id: obj.id,
        noticeId: obj.noticeId,
        cost: obj.cost
      };
      console.log(data);
      let file = document.getElementById("noticeFile").files[0];
      let formdata = new FormData();
      formdata.append('inputFile',file);
      axios({
          url:'/api/upload',
          method:'post',
          data:formdata,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then((res)=>{
        data.path = res.data.filePath;
        axios.post('/api/uploadAcceptance',data).then((response) => {
          console.log(response.data);
          if(response.data === 1){
            this.$alert('上传成功', '提示', {
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
      });
    },
    uploadPatentFile(obj){
      let data = {
        id: obj.id,
        patentId: obj.patentId
      };
      console.log(data);
      let file = document.getElementById("patentFile").files[0];
      let formdata = new FormData();
      formdata.append('inputFile',file);
      axios({
          url:'/api/upload',
          method:'post',
          data:formdata,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then((res)=>{
        data.path = res.data.filePath;
        axios.post('/api/uploadCertificate',data).then((response) => {
          console.log(response.data);
          if(response.data === 1){
            this.$alert('上传成功', '提示', {
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
      });
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
.mod-patent-apply{
  .apply-btn{
    margin-bottom: 5px;
  }
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
}
</style>
