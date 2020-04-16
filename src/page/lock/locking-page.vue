<template>
    <div class="lock-bg" :style="'width: 100%;height: 100%;background-image:'+bg_url">
        <div class="unlock-con">
            <unlock :show-unlock="showUnlock" @on-unlock="handleUnlock"></unlock>
        </div>
    </div>
</template>

<script>
import unlock from './unlock.vue';
import http from '@/assets/js/public'
var sysConfig = require('@/assets/js/sysConfig')
var preUrl = sysConfig.cmsUrlPre;
export default {
    components: {
        unlock
    },
    data () {
        return {
            bg_url:"",
            showUnlock: false
        };
    },
  created() {
    //登陆页面的背景片
    var random = Math.floor(Math.random()*7);
    this.bg_url = 'url(' + require('../../assets/img/bg0' + random + '.jpg') + ');';

  },
    methods: {
        handleUnlock () {
            let lockScreenBack = document.getElementById('lock_screen_back');
            this.showUnlock = false;
            lockScreenBack.style.zIndex = -1;
            lockScreenBack.style.boxShadow = '0 0 0 0 #667aa6 inset';
            sessionStorage.setItem("lock","unlock");
           this.$router.push({
                name:sessionStorage.getItem("lockurl") // 解锁之后跳转到锁屏之前的页面
            });
        }
    },
    mounted () {
        this.showUnlock = true;
        if (!document.getElementById('lock_screen_back')) {
            let lockdiv = document.createElement('div');
            lockdiv.setAttribute('id', 'lock_screen_back');
            lockdiv.setAttribute('class', 'lock-screen-back');
            document.body.appendChild(lockdiv);
        }
        let lockScreenBack = document.getElementById('lock_screen_back');
        lockScreenBack.style.zIndex = -1;
    }
};
</script>
<style>
  .lock-bg{
    position:fixed;
    min-width: 1000px;
    zoom: 1;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center 0;
  }
</style>
