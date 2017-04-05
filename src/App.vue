<template>
  <div id="app">
    <!-- <router-link to="/login"></router-link>
    <router-link to="/index"></router-link>
    <router-view></router-view> -->
    <login v-if="!isLogin" @login="loginSuccess"></login>
    <index v-if="isLogin" :userInfo="userInfo"></index>
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
      userInfo: {}
    };
  },
  methods: {
    //子组件登陆成功后父组件触发
    loginSuccess(data) {
      this.isLogin = true;
      this.userInfo = data;
    }
  },
  mounted() {
    axios.get('/api/isLogin')
    .then((response) => {
      console.log(response.data);
      if(response.data){
        this.isLogin = true;
        this.userInfo = response.data[0];
      }
    });
  },
  components: {
    index: index,
    login: login
  }
}
</script>
