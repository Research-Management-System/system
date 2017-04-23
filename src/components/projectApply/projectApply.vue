<template>
  <div class="mod-apply">
    <h3>我的加入状态</h3>
    <span class="notice">申请状态：0待审核、1已同意、2已拒绝。</span>
    <div class="apply-table">
      <el-table :data="applys" border style="width: 100%">
        <el-table-column prop="account" label="申请人">
        </el-table-column>
        <el-table-column prop="projectId" label="项目编号">
        </el-table-column>
        <el-table-column prop="teacher" label="负责教师">
        </el-table-column>
        <el-table-column prop="state" label="申请状态">
        </el-table-column>
        <el-table-column prop="time" label="申请时间">
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="applyLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
const applyState = ['待审核','已同意','已拒绝'];
export default {
  data(){
    return {
      "applys": this.data.projectApply.slice(0,10),
      "applyLength": this.data.projectApply.length
    };
  },
  props: ['data'],
  methods: {
    pageChange(currentPage){
      this.applys = this.data.projectApply.slice(((currentPage-1)*10),currentPage*10);
    }
  }
}
</script>

<style lang="less">
.mod-apply{
  .apply-table{
    .cell{
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .page-change{
      float: right;
      margin-top: 20px;
    }
  }
  .notice{
    display: block;
    margin-bottom: 10px;
    color: red;
    font-size: 12px;
  }
}
</style>
