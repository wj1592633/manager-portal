<template>
  <div>
    <!--http://localhost:8080/manager-boot/swagger-ui.html-->
    <iframe src="http://127.0.0.1:8080/manager-boot/swagger-ui.html" id="mobsf" scrolling="yes" frameborder="0" style=" height: 100%;width: 100%"></iframe>
  </div>
</template>


<script>
  var sysConfig = require('@/assets/js/sysConfig')
  var preUrl = sysConfig.cmsUrlPre;
  export default {
    data () {
      return {
      }
    },
    mounted(){
      /**
       * iframe-宽高自适应显示
       */
      function changeMobsfIframe(){
        const mobsf = document.getElementById('mobsf');
        const deviceWidth = document.body.clientWidth;
        const deviceHeight = document.body.clientHeight;
        mobsf.style.width = (Number(deviceWidth)-120) + 'px'; //数字是页面布局宽度差值
        mobsf.style.height = (Number(deviceHeight)-80) + 'px'; //数字是页面布局高度差
      }

      changeMobsfIframe()

      window.onresize = function(){
        changeMobsfIframe()
      }
    },
  }
</script>
