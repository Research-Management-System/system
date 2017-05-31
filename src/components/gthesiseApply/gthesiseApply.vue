<template>
  <div class="mod-gthesise-apply">
    <h3>毕业论文申请</h3>
    <el-button class="apply-btn" type="primary" @click="gthesiseApply = true">创建申请</el-button>
    <el-dialog title="毕业论文申请" v-model="gthesiseApply">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="title">
          <el-input v-model="form.title" auto-complete="off" placeholder="论文标题"></el-input>
        </el-form-item>
        <el-form-item prop="authors">
          <el-input v-model="form.authors" auto-complete="off" placeholder="论文作者"></el-input>
        </el-form-item>
        <el-form-item prop="teacher">
          <el-input v-model="form.teacher" auto-complete="off" placeholder="指导教师工号"></el-input>
        </el-form-item>
        <el-form-item prop="editor">
          <el-input v-model="form.editor" auto-complete="off" placeholder="审核教师工号"></el-input>
        </el-form-item>
        <el-form-item label="论文上传">
          <form action="/api/upload" method="post" id="fileUpload" enctype='multipart/form-data'>
              <input type="file" name ="inputFile" id="upload" />
          </form>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gthesiseApply = false">取 消</el-button>
        <el-button type="primary" @click="sendApply('form')">确 定</el-button>
      </div>
    </el-dialog>
    <h3 v-if="this.data.userInfo.type ===1">我的申请</h3>
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
        <!-- 状态为2才能上传最终版 -->
        <el-table-column label="上传最终版本">
          <template scope="gthesise">
            <form action="/api/upload" method="post" id="finalUpload" enctype='multipart/form-data'>
                <input type="file" name ="inputFile" id="uploadFinalFile" />
            </form>
            <el-button
              size="small"
              :disabled="gthesise.row.state != 2"
              @click="inputClick">选择文件</el-button>
            <el-button
              size="small"
              :disabled="gthesise.row.state != 2"
              @click="uploadFinalFile(gthesise.row)">上传</el-button>
          </template>
        </el-table-column>
        <!-- 上传过的可被下载 -->
        <el-table-column label="论文链接">
          <template scope="gthesise">
            <el-button size="small">
              <a :href="'/api/downloadFiles?id=' + gthesise.row.id +'&choice=4'">下载</a>
            </el-button>
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
const applyState = ['已拒绝','待教师审核','待上传最终版','待科研成果管理审核','xx后端设计没有4状态','审核通过'];
export default {
  data(){
    function validateTitle(rule, value, callback){
      if (value === '') {
        callback(new Error('请输入论文题目'));
      } else {
        callback();
      }
    };
    function validateAuthors(rule, value, callback){
      if (value === '') {
        callback(new Error('请输入论文作者'));
      } else if (!(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/).test(value)) {
        callback(new Error("作者格式错误"));
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
    return {
      form:{
        title: '',
        authors: '',
        teacher: '',
        editor: ''
      },
      gthesiseApply: false,
      gthesises: this.data.gthesises.slice(0,10),
      gthesiseLength: this.data.gthesises.length,
      rules: {
        title:[
            { validator: validateTitle, trigger: 'blur' }
          ],
        authors:[
            { validator: validateAuthors, trigger: 'blur' }
          ],
        teacher:[
            { validator: validateTeacher, trigger: 'blur' }
          ],
        editor:[
            { validator: validateTeacher, trigger: 'blur' }
          ]
      }
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
    sendApply(formName){
      let data = {
        title: this.form.title,
        authors: this.form.authors,
        teacher: this.form.teacher,
        editor: this.form.editor
      };
      let file = document.getElementById("upload").files[0];
      if(!file){
        this.$alert('未选择文件', '提示', {
          confirmButtonText: '确定'
        });
      }else{
        this.$refs[formName].validate((valid) => {
            if (valid) {
              let formdata = new FormData();
              formdata.append('inputFile',file);
              formdata.append('type','1');//type1毕业论文
              axios({
                  url:'/api/upload',
                  method:'post',
                  data:formdata,
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then((res)=>{
                data.path = res.data.filePath;
                axios.post('/api/gthesisApply',data).then((response) => {
                  console.log(response.data);
                  if(response.data === 1){
                    console.log("申请成功");
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
            } else {
              console.log('error submit!!');
              return false;
            }
        });
      }
    },
    downloadFile(id,choice){
      let url = '/api/downloadFiles?id=' + id +'&choice=' + choice;
      console.log(url);
      axios.get(url);
    },
    inputClick(){
      let fileDom = document.getElementById("uploadFinalFile");
      fileDom.click();
    },
    uploadFinalFile(obj){
      let data = {
        id: obj.id,
        state: 3
      };
      console.log(data);
      let fileDom = document.getElementById("uploadFinalFile");
      let file = fileDom.files[0];
      if(file){
        let formdata = new FormData();
        formdata.append('inputFile',file);
        formdata.append('type','1');//type1毕业论文
        axios({
            url:'/api/upload',
            method:'post',
            data:formdata,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((res)=>{
          data.path = res.data.filePath;
          axios.post('/api/submitGthesisInfos',data).then((response) => {
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
    this.gthesises.forEach(item => {
      item.applyState = (applyState[item.state]);
    });
  }
}
</script>

<style lang="less">
.mod-gthesise-apply{
  .apply-btn{
    margin-bottom: 5px;
  }
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
  a{
    text-decoration: none;
    color: #000;
  }
}
#finalUpload{
  display: none;
}
</style>
