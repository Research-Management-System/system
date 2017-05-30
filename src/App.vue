<template>
  <div id="app">
    <!-- <router-link to="/login"></router-link>
    <router-link to="/index"></router-link>
    <router-view></router-view> -->
    <login v-if="!isLogin" @login="loginSuccess"></login>
    <index v-if="isLogin" :data="data"></index>
  </div>
</template>

<script>
import login from './components/login';
import index from './components/index';
import axios from 'axios';
export default {
  data(){
    return {
      isLogin: false,
      data: {}
    };
  },
  methods: {
    //子组件登陆成功后父组件触发
    loginSuccess(data) {
      this.isLogin = true;
      this.data = data;
      if(data.userInfo.type === 0){
        location.href = "/#/teacherCheck";
      }
    }
  },
  mounted() {
    axios.get('/api/isLogin')
    .then((response) => {
      if(response.data && response.data.userInfo.state != 0){
        this.isLogin = true;
        this.data = response.data;
        console.log(this.data);
      }
    });
  },
  components: {
    index: index,
    login: login
  }
}
</script>
