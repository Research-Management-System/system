<template>
  <div class="mod-gthesise-apply">
    <h3>毕业论文申请</h3>
    <el-button class="apply-btn" type="primary" @click="gthesiseApply = true">创建申请</el-button>
    <el-dialog title="毕业论文申请" v-model="gthesiseApply">
      <el-form>
        <el-form-item>
          <el-input v-model="title" auto-complete="off" placeholder="论文标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="authors" auto-complete="off" placeholder="论文作者"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="teacher" auto-complete="off" placeholder="指导教师工号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="editor" auto-complete="off" placeholder="审核教师工号"></el-input>
        </el-form-item>
        <el-form-item label="论文上传">
          <form action="/api/fileupload" method="post" enctype='multipart/form-data'  onsubmit="return checkTask(this)">
              <input type="file" id="uploadPdf" />
          </form>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gthesiseApply = false">取 消</el-button>
        <el-button type="primary" @click="sendApply">确 定</el-button>
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
        <el-table-column prop="state" label="申请状态">
        </el-table-column>
        <el-table-column label="论文链接">
          <template>
            下载
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
const applyState = ['被拒绝','待教师审核','待财务管理审核','待科研管理审核','审核通过'];
export default {
  data(){
    return {
      title: '',
      authors: '',
      teacher: '',
      editor: '',
      gthesiseApply: false,
      gthesises: this.data.gthesises.slice(0,10),
      gthesiseLength: this.data.gthesises.length,
    }
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.gthesises = this.data.gthesises.slice(((currentPage-1)*10),currentPage*10);
      this.gthesises.forEach(item => {
        item.state = applyState[item.state];
      });
    },
    sendApply(){
      let data = {
        title: this.title,
        authors: this.authors,
        teacher: this.teacher,
        editor: this.editor
      };
      axios.post('/api/gthesisApply',data).then((response) => {
        console.log(response.data);
        if(response.data === 1){
          console,log("hhh");
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
  },
  created() {
    this.gthesises.forEach(item => {
      item.state = applyState[item.state];
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
}
</style>
