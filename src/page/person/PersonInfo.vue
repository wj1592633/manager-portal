<template>
  <div class="layout">

      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
            <MenuItem name="1-1" to="/index/person/details">基本信息</MenuItem>
            <MenuItem name="1-2" to="/index/person/security">安全设置</MenuItem>
          </Menu>
        </Sider>
        <Content :style="{padding: '24px', minHeight: '100vh', background: '#fff'}">
         <router-view></router-view>
        </Content>
      </Layout>
  </div>
</template>
<script>
  export default {
    methods:{
      gotoPage(name, params) {
        this.$router.replace({name, params})
      },
    }
  }
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
</style>
