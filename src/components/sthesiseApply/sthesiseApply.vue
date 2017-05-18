<template>
  <div class="mod-sthesise-apply">
    <h3>小论文申请</h3>
    <el-button class="apply-btn" type="primary" @click="sthesiseApply = true">创建申请</el-button>
    <el-dialog title="小论文申请" v-model="sthesiseApply">
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
          <input type="file" id="uploadPdf" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sthesiseApply = false">取 消</el-button>
        <el-button type="primary" @click="sendApply">确 定</el-button>
      </div>
    </el-dialog>
    <h3 v-if="this.data.userInfo.type ===1">我的申请</h3>
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
        <el-table-column label="论文链接">
          <template>
            下载
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="sthesiseLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
const applyState = ['待教师审核','待管理审核','审核通过'];
export default {
  data(){
    return {
      title: '',
      authors: '',
      teacher: '',
      editor: '',
      sthesiseApply: false,
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
    sendApply(){
      let data = {
        title: this.title,
        authors: this.authors,
        teacher: this.teacher,
        editor: this.editor
      };
      let file = document.getElementById('uploadPdf').value;
      console.log(data);
      console.log(file);
    }
  },
  created() {
    this.sthesises.forEach(item => {
      item.applyState = applyState[item.state];
    });
  }
}
</script>

<style lang="less">
.mod-sthesise-apply{
  .apply-btn{
    margin-bottom: 5px;
  }
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
