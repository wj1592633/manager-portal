<template>
  <div>
    <Poptip trigger="click" placement="right" title="选择角色" width="250">
      <div style="display:flex;">
        <Input
          v-model="roleName"
          readonly
          style="margin-right:10px;width: 280px"
          placeholder="点击选择角色"
        />
        <Button icon="md-trash" @click="clearSelect">清空已选</Button>
      </div>
      <div slot="content" class="tree-bar">
        <Input
          v-model="searchKey"
          suffix="ios-search"
          @on-change="searchDep"
          placeholder="输入角色名搜索"
          clearable
        />
        <Tree
          :data="dataDep"
          :load-data="loadData"
          @on-select-change="selectTree"
        ></Tree>
        <Spin size="large" fix v-if="depLoading"></Spin>
      </div>
    </Poptip>
  </div>
</template>

<script>
  //import { initDepartment, loadDepartment, searchDepartment } from "@/api/index";
  import http from '@/assets/js/public'
  var sysConfig = require('@/assets/js/sysConfig')
  var preUrl = sysConfig.cmsUrlPre;

  export default {
    name: "roleTreeChoose",
    props:['role_name'],

    data() {
      return {
        depLoading: false,
        roleName: "",
        searchKey: "",
        dataDep: [],
        selectDep: [],
        department: [],
      };
    },
    methods: {
      initRoleData() {
        http.requestQuickGet(preUrl+"/role/treelist").then((data)=>{
          if (data.state === '200'){
            this.dataDep = data.data
          }else {
            this.$Message.error(data.failMsg ? data.failMsg : "获取角色失败");
          }
        },(error)=>{
          this.$Message.error("获取角色失败");
        });

      },
      loadData(item, callback) {
        loadDepartment(item.id).then(res => {
          if (res.success === true) {
            res.result.forEach(function(e) {
              if (e.isParent) {
                e.loading = false;
                e.children = [];
              }
              if (e.status === -1) {
                e.title = "[已禁用] " + e.title;
                e.disabled = true;
              }
            });
            callback(res.result);
          }
        });
      },
      searchDep() {
        // 搜索部门
        if (this.searchKey) {
          this.depLoading = true;
          searchDepartment({ title: this.searchKey }).then(res => {
            this.depLoading = false;
            if (res.success) {
              res.result.forEach(function(e) {
                if (e.status === -1) {
                  e.title = "[已禁用] " + e.title;
                  e.disabled = true;
                }
              });
              this.dataDep = res.result;
            }
          });
        } else {
          this.initRoleData();
        }
      },
      selectTree(v) {
        let roleid = '';
        let ids = [],
          title = "";
        v.forEach(e => {
          roleid = e.id;
          ids.push(e.id);
          if (title == "") {
            title = e.title;
          } else {
            title = title + "、" + e.title;
          }
        });
        this.roleId = ids;
        this.roleName = title;
        this.$emit("onRolechange", {'roleid':roleid,'roleName':title});
      },
      clearSelect() {
        this.roleId = [];
        this.roleName = "";
        this.initRoleData();
        //this.$emit("onRolechange", "");
      },
      setSelectDep(ids, title){
        this.roleId = ids;
        this.roleName = title;
       // this.$emit("onRolechange", this.roleId);
      }
    },
    created() {
      this.initRoleData();
    },
   watch:{
      'role_name':function () {
        if(this.role_name !== undefined){
          this.roleName = this.role_name;
        }else {
          this.roleName = ""
        }

      }
    }
  };
</script>

<style>
  .tree-bar {
    max-height: 500px;
    overflow: auto;
    margin-top: 5px;
  }
  .tree-bar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .tree-bar::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
  }
  .ivu-tree .ivu-tree-empty {
    margin-top: 10px;
    font-size: 12px;
  }
</style>
