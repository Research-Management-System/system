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
          <el-input v-model="projectId" auto-complete="off" placeholder="项目编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="teacher" auto-complete="off" placeholder="审核教师工号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="description" auto-complete="off" placeholder="描述"></el-input>
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
        <el-table-column prop="projectId" label="所属项目编号">
        </el-table-column>
        <el-table-column prop="kind" label="报账类型">
        </el-table-column>
        <el-table-column prop="cost" label="报账金额">
        </el-table-column>
        <el-table-column prop="account" label="分配报账账号">
        </el-table-column>
        <el-table-column prop="applyState" label="申请状态">
        </el-table-column>
        <el-table-column label="上传票据">
            <template scope="render">
              <form action="/api/upload" method="post" id="finalUpload" enctype='multipart/form-data'>
                  <input type="file" name ="inputFile" id="uploadFinalFile" />
              </form>
              <el-button
                size="small"
                :disabled="render.row.state != 3"
                @click="inputClick">选择文件</el-button>
              <el-button
                size="small"
                :disabled="render.row.state != 3"
                @click="uploadFinalFile(render.row)">上传</el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page-change" @current-change="pageChange" layout="prev, pager, next" :total="renderLength" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const applyState = ['已拒绝','待教师审核','待财务管理员审核','待上传票据','待财务管理员二审','审核通过'];
export default {
  data(){
    return {
      kind: '',
      cost: '',
      projectId: '',
      description: '',
      teacher: '',
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
        item.applyState = applyState[item.state];
      });
    },
    sendApply(){
      let data = {
        kind: this.kind,
        cost: this.cost,
        description: this.description,
        teacher: this.teacher,
        projectId: this.projectId
      };
      axios.post('/api/renderApply',data).then((response) => {
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
          axios.post('/api/submitRenderInfos',data).then((response) => {
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
    this.renders.forEach(item => {
      item.applyState = applyState[item.state];
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
