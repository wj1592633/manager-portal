<template>
  <Tree :data="menuTreeData" show-checkbox multiple></Tree>
</template>
<script>
  import http from '@/assets/js/public'
  var sysConfig = require('@/assets/js/sysConfig')
  var preUrl = sysConfig.cmsUrlPre;

  export default {
    data () {
      return {
        menuTreeData: []
      }
    },
    props:['roleid'],
    methods:{
      initMenuData(roleid){
        http.requestGet(preUrl+"/menu/treelist",{'roleid':roleid}).then((data)=>{
          if (data.state === '200'){
            this.menuTreeData = data.data
          }else {
            this.$Message.error(data.failMsg ? data.failMsg : "加载权限菜单失败");
          }
        },(error)=>{
          this.$Message.error("加载权限菜单失败");
        });
      }
    },

    watch:{
      'roleid':()=> {
        this.initMenuData(this.roleid)
      }
    }
  }
</script>
