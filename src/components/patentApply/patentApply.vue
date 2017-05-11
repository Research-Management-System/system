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
          <el-input v-model="authors" auto-complete="off" placeholder="发明人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="projectId" auto-complete="off" placeholder="项目id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="applystate" auto-complete="off" placeholder="申请状态"></el-input>
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
    <h3 v-if="this.data.userInfo.type ===1">我的申请</h3>
    <div class="patent-table">
      <el-table :data="patents" border style="width: 100%">
        <el-table-column prop="id" label="专利编号">
        </el-table-column>
        <el-table-column prop="name" label="专利名称">
        </el-table-column>
        <el-table-column prop="inventor" label="发明人">
        </el-table-column>
        <el-table-column prop="state" label="申请状态">
        </el-table-column>
        <el-table-column label="操作">
          <template>
            下载
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="patentLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
const applyState = ['待教师审核','待管理审核','审核通过'];
export default {
  data(){
    return {
      name: '',
      authors: '',
      projectId: '',
      description: '',
      patentApply: false,
      patents: this.data.patents.slice(0,10),
      patentLength: this.data.patents.length
    }
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.patents = this.data.patents.slice(((currentPage-1)*10),currentPage*10);
      this.patents.forEach(item => {
        item.state = applyState[item.state];
      });
    },
    sendApply(){
      let data = {
        name: this.name,
        authors: this.authors,
        projectId: this.projectId,
        description: this.description
      };
      console.log(data);
    }
  },
  created() {
    this.patents.forEach(item => {
      item.state = applyState[item.state];
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
