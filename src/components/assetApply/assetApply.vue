<template>
  <div class="mod-asset-apply">
    <h3>专利申请</h3>
    <el-button class="apply-btn" type="primary" @click="assetApply = true">创建申请</el-button>
    <el-dialog title="专利申请" v-model="assetApply">
      <el-form>
        <el-form-item>
          <el-input v-model="band" auto-complete="off" placeholder="设备厂商"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="name" auto-complete="off" placeholder="设备名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="model" auto-complete="off" placeholder="型号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="cost" auto-complete="off" placeholder="价格"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="projectId" auto-complete="off" placeholder="项目id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="teacher" auto-complete="off" placeholder="负责教师"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assetApply = false">取 消</el-button>
        <el-button type="primary" @click="sendApply">确 定</el-button>
      </div>
    </el-dialog>
    <h3 v-if="this.data.userInfo.type ===1">我的申请</h3>
    <div class="asset-table">
      <el-table :data="assets" border style="width: 100%">
        <el-table-column prop="band" label="设备厂商">
        </el-table-column>
        <el-table-column prop="name" label="设备名">
        </el-table-column>
        <el-table-column prop="model" label="型号">
        </el-table-column>
        <el-table-column prop="cost" label="价格">
        </el-table-column>
        <el-table-column prop="state" label="申请状态">
        </el-table-column>
        <el-table-column label="操作">
          <template>
            下载
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="assetLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
const applyState = ['待教师审核','待管理审核','审核通过'];
export default {
  data(){
    return {
      band: '',
      name: '',
      model: '',
      cost: '',
      projectId: '',
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
    this.assets.forEach(item => {
      item.state = applyState[item.state];
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
