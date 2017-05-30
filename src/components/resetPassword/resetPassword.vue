<template>
  <div class="mod-reset-password">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="需重置密码账号" prop="account">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-button type="primary" @click="resetPassword('form')">重置密码</el-button>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data(){
    function validateAccount(rule, value, callback){
      if (value === '') {
        callback(new Error('请输入账号'));
      } else if (!(/^[0-9]{6,11}$/).test(value)) {
        callback(new Error("无效的账号格式"));
      } else {
        callback();
      }
    };
    return {
      flag: false,
      form:{
        account: ''
      },
      rules: {
        account:[
            { validator: validateAccount, trigger: 'blur' }
          ]
      }
    }
  },
  prop: ['data'],
  methods: {
    resetPassword(formName){
      console.log(this.$refs[formName]);
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              account: this.form.account
            }
            axios.post('/api/resetPassword',data).then((response) => {
              if(response.data == 1){
                this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定'
                });
              }else{
                this.$alert('操作失败', '提示', {
                  confirmButtonText: '确定'
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  }
}
</script>

<style lang="less">
  .mod-reset-password{
    input{
      width: 200px;
    }
  }
</style>
