<template>
    <div class="login-vue" :style="bg">
      <Spin size="large" fix v-if="spinShow"></Spin>
        <div class="container">
            <p class="title">WELCOME</p>
            <div class="input-c">
              <i-input   v-model="account" placeholder="用户名" clearable  @on-blur="verifyAccount"  style="width: 200px"></i-input>
                <p class="error" style="font-size: 14px">{{accountError}}</p>
            </div>
            <div class="input-c">
              <i-input  type="password" v-model="pwd"  placeholder="密码" clearable  @on-blur="verifyPwd"  style="width: 200px"></i-input>
                <p class="error" style="font-size: 14px">{{pwdError}}</p>
            </div>
           <!-- <Button :loading="isShowLoading" class="submit" type="primary" @click="submit">登陆</Button>-->
          <i-button :loading="isShowLoading" type="primary" @click="submit" style="width: 200px" >登陆</i-button>
            <p class="account"><span @click="register">注册账号</span> | <span @click="forgetPwd">忘记密码</span></p>
        </div>
    </div>
</template>

<script>
  import http from '@/assets/js/public'
  var sysConfig = require('@/assets/js/sysConfig')
  var preUrl = sysConfig.cmsUrlPre;
export default {

    name: 'Login',
    data() {
        return {
            account: 'boss',
            pwd: '111',
            accountError: '',
            pwdError: '',
            isShowLoading: false,
            spinShow :false,
            bg: {}
        }
    },
    created() {
      //登陆页面的背景片
      var random = Math.floor(Math.random()*7);
      this.bg.backgroundImage = 'url(' + require('../../assets/img/bg0' + random + '.jpg') + ')';

    },
    mounted() {
      this.cleanToken();
      this.$Notice.open({
        title: '登陆提示',
        desc: "账号:boss  密码:111"
      });
        document.onkeydown = e => {
            // 监听回车事件
            if (e.keyCode == 13) {
                this.submit()
            }
        }
    },
    methods: {
      cleanToken(){
        localStorage.removeItem(sysConfig.accessTokenKey);
        localStorage.removeItem(sysConfig.refreshTokenKey);
      },
        verifyAccount(e) {
          var obj = this.account;
          if(typeof obj === "undefined" || obj === null || obj === ""){
                this.accountError = '账号不能为空';
                return false;
            } else {
                this.accountError = '';
                return true;
            }
        },
        verifyPwd(e) {
          var obj = this.pwd;
          if(typeof obj === "undefined" || obj === null || obj === ""){
            this.pwdError = '密码不能为空';
            return false;
          } else {
                this.pwdError = '';
                return true;
            }
        },
        register() {
          this.$Message.info('注册账号_模块_正在建设中....');
        },
        forgetPwd() {
          this.$Message.info('忘记密码_模块_正在建设中....');
        },
        submit() {
          if(this.verifyAccount() && this.verifyPwd()){
            this.spinShow = true;
            localStorage.removeItem(sysConfig.accessTokenKey);
            localStorage.removeItem(sysConfig.refreshTokenKey);
            http.requestPost(preUrl+"/auth/login",{"account" : this.account, "password" : this.pwd}).then(
              (data)=>{
                if(data.state === '200'){
                  this.spinShow = false;
                  this.$router.replace("/index/home");
                  localStorage.setItem(sysConfig.accessTokenKey,data.data.jwtToken);
                  localStorage.setItem(sysConfig.refreshTokenKey,data.data.refreshToken);
                }else {
                  this.spinShow = false;
                  this.$Message.error(data.failMsg?data.failMsg:"登陆失败，请重试!");
                }

              },
              (error)=>{
                this.spinShow = false;
                this.$Notice.open({
                  desc: '网络异常'
                });
              }
            )
          }
        }
    }
}
</script>

<style>
.login-vue {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
}
.login-vue .container {
    background: rgba(255, 255, 255, .5);
    width: 300px;
    text-align: center;
    border-radius: 10px;
    padding: 30px;
}
.login-vue .ivu-input {
    background-color: transparent;
    color: #fff;
    outline: #fff;
    border-color: #fff;
}
.login-vue ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: rgba(255, 255, 255, .8);
}
.login-vue :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba(255, 255, 255, .8);
}
.login-vue ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba(255, 255, 255, .8);
}
.login-vue :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba(255, 255, 255, .8);
}
.login-vue .title {
    font-size: 16px;
    margin-bottom: 20px;
}
.login-vue .input-c {
    margin: auto;
    width: 200px;
}
.login-vue .error {
    color: red;
    text-align: left;
    margin: 5px auto;
    font-size: 12px;
    padding-left: 30px;
    height: 20px;
}
.login-vue .submit {
    width: 200px;
}
.login-vue .account {
    margin-top: 30px;
}
.login-vue .account span {
    cursor: pointer;
}
.login-vue .ivu-icon {
    color: #eee;
}
.login-vue .ivu-icon-ios-close-circle {
    color: #777;
}
</style>


