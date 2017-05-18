<template>
  <div class="mod-asset-check">
    <h3>固定资产查看</h3>
    <div class="asset-table">
      <el-table :data="assets" border style="width: 100%">
        <el-table-column prop="deviceId" label="设备号">
        </el-table-column>
        <el-table-column prop="name" label="设备名">
        </el-table-column>
        <el-table-column prop="projectId" label="项目号">
        </el-table-column>
        <el-table-column prop="deviceState" label="设备状态">
        </el-table-column>
        <el-table-column prop="user" label="使用人">
        </el-table-column>
        <el-table-column prop="state" label="申请审批状态">
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="assetLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      "assets": this.data.assets.slice(0,10),
      "assetLength": this.data.projectApply.length
    };
  },
  props:['data'],
  methods:{
    pageChange(currentPage){
      this.assets = this.data.assets.slice(((currentPage-1)*10),currentPage*10);
    }
  }
}
</script>

<style lang="css">
</style>
