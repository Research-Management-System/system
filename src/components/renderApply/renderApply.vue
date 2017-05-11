<template>
  <div class="mod-render-apply">
    <h3>不入库报账申请</h3>
    <el-button class="apply-btn" type="primary" @click="renderApply = true">创建申请</el-button>
    <el-dialog title="不入库报账申请" v-model="renderApply">
      <el-form>
        <el-form-item>
          <el-input v-model="kind" auto-complete="off" placeholder="报账类型"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="cost" auto-complete="off" placeholder="报账金额"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="projectId" auto-complete="off" placeholder="报账id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="description" auto-complete="off" placeholder="专利描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="renderApply = false">取 消</el-button>
        <el-button type="primary" @click="sendApply">确 定</el-button>
      </div>
    </el-dialog>
    <h3>我的申请</h3>
    <div class="render-table">
      <el-table :data="renders" border style="width: 100%">
        <el-table-column prop="id" label="专利编号">
        </el-table-column>
        <el-table-column prop="kind" label="保障类型">
        </el-table-column>
        <el-table-column prop="cost" label="报账金额">
        </el-table-column>
        <el-table-column prop="state" label="申请状态">
        </el-table-column>
        <el-table-column label="操作">
          <template>
            下载
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="renderLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
const applyState = ['待教师审核','待管理审核','审核通过'];
export default {
  data(){
    return {
      kind: '',
      cost: '',
      projectId: '',
      description: '',
      renderApply: false,
      renders: this.data.renders.slice(0,10),
      renderLength: this.data.renders.length
    }
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.renders = this.data.renders.slice(((currentPage-1)*10),currentPage*10);
      this.renders.forEach(item => {
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
      console.log(data);
    }
  },
  created() {
    this.renders.forEach(item => {
      item.state = applyState[item.state];
    });
  }
}
</script>

<style lang="less">
.mod-render-apply{
  .apply-btn{
    margin-bottom: 5px;
  }
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
}
</style>
