<template>
  <div>
    <div style="margin: 10px" class="search-input">
      <Row> <Col span="5">角色名称: <Input v-model="name" size="default" style="width: auto" clearable placeholder="请输入角色名称" /></Col>
        <Col span="2"><Button shape="circle"  icon="ios-search" @click="searchRole"></Button></Col>
        <Col span="3"><Button shape="circle"  icon="md-add" @click="handleAddRole"> 添加角色</Button></Col>
      </Row>
    </div>

    <Table ref="roleTable"  :height="fixedHeader ? 250 : ''"  :data="tableData3" :columns="tableColumns3"></Table>

    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalRecodes" show-sizer show-elevator :current="page" :page-size="pageSize" @on-change="changePage"  @on-page-size-change="onPageSizeChange"></Page>
      </div>
    </div>
    <!--添加/修改角色的弹窗-->
    <Modal
      v-model="addModalVisible"
      :title="modalTitle"
      @on-ok="ok"
      class-name="vertical-center-modal"
      @on-cancel="cancel">

      <Form  ref="addRoleData" :model="addRoleData" :rules="ruleValidate" :label-width="80">
        <FormItem label="角色名称" prop="name">
          <Input v-model="addRoleData.name" placeholder="输入角色名称"></Input>
        </FormItem>
        <FormItem label="角色别名" prop="tips">
          <Input v-model="addRoleData.tips" placeholder="输入角色别名"></Input>
        </FormItem>


        <Form-item label="上级角色"  prop="pName">
          <role-tree-choose width="285px" :role_name="addRoleData.pName" @onRolechange="onRolechange" ref="roleTree"></role-tree-choose>
        </Form-item>

        <FormItem label="角色排序" prop="num">
          <InputNumber :max="10" :min="1" v-model="addRoleData.num" placeholder="数值越大排序越后" style="width: 280px"></InputNumber>
        </FormItem>
      </Form>


    </Modal>
    <!--删除角色的弹窗-->
    <Modal
      v-model="showDeleteModal"
      :title="modalTitle"
      class-name="vertical-center-modal"
      @on-ok="sureDelete"
      @on-cancel="cancel1">
      {{deleteMessage}}
    </Modal>
    <!--分配权限的弹窗-->
    <Modal
      v-model="showPermissionModal"
      :title="modalTitle"
      class-name="vertical-modal"
      @on-ok="surePermission"
      @on-cancel="cancel1">
      <Tree  ref="permissionTree" :data="menuTreeData" show-checkbox multiple></Tree>
    </Modal>

  </div>
</template>
<script>
  import http from '@/assets/js/public'
  import roleTreeChoose from "@/components/common/RoleTreeChoose";
  //import permissionTree from "./PermissionTree.vue"
  var sysConfig = require('@/assets/js/sysConfig')
  var preUrl = sysConfig.cmsUrlPre;

  export default {
    components: {
      roleTreeChoose,
      //permissionTree
    },
    data () {
      return {
        data2: [],
        tableData3:[],
        menuTreeData: [],
        fixedHeader: false,
        tableSize: 'default',
        totalRecodes:0,
        page:1,
        pageSize:10,
        name:'',
        addModalVisible:false,
        showDeleteModal:false,
        showPermissionModal:false,
        modalTitle:"",
        deleteMessage:'',
        sureDeleteData:{},
        addRoleData: {
          id:"",//null
          num:"",//null
          pid: "",//null
          name: "",
          deptid: "",//null
          deptName: "",
          tips:"",
          pName:""
        },
        ruleValidate: {
          name: [
            {required: true, message: '名字不能为空', trigger: 'blur'}
          ],
          tips: [
            {required: true, message: '别名不能为空', trigger: 'blur'}
          ],
          pName: [
            {required: true, message: '上级角色不能为空', trigger: 'blur'}
          ]
        },
      }
    },
    methods:{

      editPermission(param){
        this.modalTitle = "分配权限"
        this.addRoleData.id = param.row.id;
        http.requestGet(preUrl+"/menu/treelist",{'roleid':param.row.id}).then((data)=>{
          if (data.state === '200'){
            this.menuTreeData = data.data
          }else {
            this.$Message.error(data.failMsg ? data.failMsg : "加载权限菜单失败");
          }
        },(error)=>{
          this.$Message.error("加载权限菜单失败");
        });
        this.showPermissionModal = true;
      },
      editRole(data){
        this.modalTitle = "修改角色"
        this.addRoleData = data.row
        this.addModalVisible = true;
      },
      onRolechange(role){
        this.addRoleData.pid = role.roleid;
        this.addRoleData.pName = role.roleName;
      },
      handleAddRole(){
        this.addRoleData = {};
        this.modalTitle="添加角色";
        this.addModalVisible = true;
      },
      searchRole(){
        http.requestGet(preUrl+"/role/list",{page:this.page,size:this.pageSize,keyword:this.name}).then((data)=>{
          if(data.state === '200'){
            let res = data.data;
            this.tableData3 = res.records;
            this.totalRecodes = res.total;
          }else {
            this.$Notice.error({
              desc: 'The desc will hide when you set render.',
              render: h => {
                return h('span', [
                  data.failMsg
                ])
              }
            });
          }

        },(error)=>{
          this.$Notice.error({
            desc: 'The desc will hide when you set render.',
            render: h => {
              return h('span', [
                '请求失败，请重试'
              ])
            }
          });
        });
      },
      onPageSizeChange(nowSize){
        this.pageSize = nowSize;
        this.changePage(1);
      },
      changePage (page) {
        this.page = page;
        http.requestGet(preUrl+"/role/list",{page:this.page,size:this.pageSize,keyword:this.name}).then((data)=>{
          if(data.state === '200'){
            let res = data.data;
            this.tableData3 = res.records;
            this.totalRecodes = res.total;
          }else {
            this.$Notice.error({
              desc: 'The desc will hide when you set render.',
              render: h => {
                return h('span', [
                  data.failMsg
                ])
              }
            });
          }

        },(error)=>{
          this.$Notice.error({
            desc: 'The desc will hide when you set render.',
            render: h => {
              return h('span', [
                '请求失败，请重试'
              ])
            }
          });
        });
      },
      initMenuData(){
        http.requestQuickGet(preUrl+"/menu/treelist").then((data)=>{
          if (data.state === '200'){
            this.data2 = data.data
          }else {
            this.$Message.error(data.failMsg ? data.failMsg : "加载权限菜单失败");
          }
        },(error)=>{
          this.$Message.error("加载权限菜单失败");
        });
      },
      ok(){
        var url="";
        if( this.modalTitle === "添加角色"){
          url=preUrl+"/role/add"
        }else if(this.modalTitle === "修改角色"){
          url=preUrl+"/role/edit"
        }
       http.requestPost(url,this.addRoleData).then((data)=>{
         if(data.state === "200"){
           this.$Message.success(this.modalTitle + "成功")
           if( this.modalTitle === "添加角色"){
             this.changePage(this.page)
             this.addRoleData={};
           }
         }else {
           this.$Message.error(data.failMsg ? data.failMsg :this.modalTitle + "失败")
         }
       },(error)=>{
         this.$Message.error(this.modalTitle + "失败")
       });
      },
      cancel(){
        this.addRoleData = {}
      },
      cancel1(){
        this.menuTreeData = [];//null
      },
      surePermission(){
        //获取tree上所有选中及半选中的元素
        var pers =  this.$refs.permissionTree.getCheckedAndIndeterminateNodes();
        var permissinIds=[];
        pers.forEach((item)=>{
          permissinIds.push(item.id)
        })
        http.requestPost(preUrl+"/relation/update",{'roleId':this.addRoleData.id,'menuIds':permissinIds}).then((data)=>{
          if(data.state === '200'){
            this.$Message.success(data.data?data.data:"分配权限成功")
          }else {
            this.$Message.error(data.failMsg?data.failMsg:"分配权限失败")
          }
        },(error)=>{
          this.$Message.error(data.failMsg?data.failMsg:"分配权限失败")
        });
      },
      sureDelete(){
        http.requestPost(preUrl+"/role/delete",{'roleid':this.sureDeleteData.row.id}).then((data)=>{
          if(data.state === "200"){
            this.changePage(this.page)
            this.$Message.success("删除成功")
          }else {
            this.$Message.error(data.failMsg ? data.failMsg :"删除失败")
          }
        },(error)=>{
          this.$Message.error("删除失败")
        });
      }
    },
   created(){
     this.changePage (1);
     //this.initMenuData();
   },
    computed: {
      tableColumns3 () {
        let columns = [];
        columns.push({
          title: '名称',
          sortable: true,
          align: 'center',
          key: 'name'

        });
        columns.push({
          title: '别名',
          sortable: true,
          align: 'center',
          key: 'tips'
        });

        columns.push(
          {
            title: '操作',
            key: 'action',
            width: 280,
            align: 'center',
            render: (h, params) => {
              return h('div', [

                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    ghost:true
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editRole(params)
                    }
                  }
                }, '修改'),

                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.deleteMessage = "确定删除名字为"+params.row.name+"的角色及其子角色?"
                      this.modalTitle = "请再次确认"
                      this.showDeleteModal = true
                      this.sureDeleteData = params;
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editPermission(params)
                    }
                  }
                }, '分配权限'),

              ]);
            }
          }

        );
        return columns;
      }
    }
  }
</script>
<style>
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vertical-modal{
   margin-top: auto;
  }
</style>
