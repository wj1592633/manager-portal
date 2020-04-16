<template>
<div>
  <div style="margin: 10px" class="search-input">
    <Row> <Col span="5">用户名称: <Input v-model="name" size="default" style="width: auto" clearable placeholder="请输入用户名称" /></Col>
      <Col span="2"><Button shape="circle"  icon="ios-search" @click="searchUser"></Button></Col>
      <Col span="3"><Button shape="circle"  icon="md-add" @click="handleAddUser"> 添加用户</Button></Col>
    </Row>
  </div>

  <div style="margin: 10px">
    <Row>
      <Col span="3">表格边线 <i-switch v-model="showBorder" style="margin-right: 5px"></i-switch></Col>
      <Col span="3">间行变色 <i-switch v-model="showStripe" style="margin-right: 5px"></i-switch></Col>
      <Col span="3">表格序号 <i-switch v-model="showIndex" style="margin-right: 5px"></i-switch></Col>
      <Col span="3">表格多选 <i-switch v-model="showCheckbox" style="margin-right: 5px"></i-switch></Col>
      <Col span="3">表格头部 <i-switch v-model="showHeader" style="margin-right: 5px"></i-switch></Col>
      <Col span="3">滚动条 <i-switch v-model="fixedHeader" style="margin-right: 5px"></i-switch></Col>
      <Col span="6">
      表格尺寸 &nbsp;&nbsp;&nbsp;
    <Radio-group v-model="tableSize" type="button">
      <Radio label="large">大</Radio>
      <Radio label="default">中(默认)</Radio>
      <Radio label="small">小</Radio>
    </Radio-group>
      </Col>
  </Row>
  </div>

  <Table ref="userTable" :border="showBorder" :stripe="showStripe" :show-header="showHeader" :height="fixedHeader ? 250 : ''" :size="tableSize" :data="tableData3" :columns="tableColumns3"></Table>

  <div style="margin: 10px;overflow: hidden">
    <div style="float: right;">
      <Page :total="totalRecodes" show-sizer show-elevator :current="page" :page-size="pageSize" @on-change="changePage"  @on-page-size-change="onPageSizeChange"></Page>
    </div>
  </div>

  <!--添加用户的弹窗-->
  <Modal
    v-model="userModalVisible"
    :title="modalTitle"
    :loading="Mloading"
    class-name="vertical-center-modal"
    @on-cancel="cancel">

    <Form id="addUserForm"  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="姓名" prop="name">
        <Input v-model="formValidate.name" name="name" placeholder="输入名字"></Input>
      </FormItem>
      <FormItem label="账号" prop="account">
        <Input v-model="formValidate.account" name="account" placeholder="输入账号"></Input>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input type="password" v-model="formValidate.password" name="password" placeholder="输入密码"></Input>
      </FormItem>

      <Form-item label="头像" prop="avatar">
        <uploadSinglePic @on-change="handleUpload" :avatar="''"  width="285px" ref="upload"></uploadSinglePic>
      </Form-item>

      <FormItem label="邮箱" prop="email">
        <Input v-model="formValidate.email" name="email" placeholder="输入邮箱"></Input>
      </FormItem>

      <Form-item label="所属部门">
        <dept-tree-choose width="285px" :deptName="''" @onDeptchange="onDeptchange" ref="depTree"></dept-tree-choose>
      </Form-item>


      <FormItem label="性别" prop="sex">
       <!-- RadioGroup 的name="sex" 就是key-->
        <RadioGroup  name="sex" v-model="formValidate.sex">
         <!-- <Radio name="sex"  label="1"></Radio>
          <Radio name="sex"  label="2"></Radio>-->
          <Radio   :label="1" >
            <span>男</span>
          </Radio>
          <Radio   :label="2" >
            <span>女</span>
          </Radio>
        </RadioGroup>
      </FormItem>

    </Form>


  <div class="demo-drawer-footer">
      <Button style="margin-right: 8px"  @click="userModalVisible = false">取消</Button>
      <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
    </div>
  </Modal>


  <!--修改用户的弹窗-->
  <Modal
    v-model="editModalVisible"
    :title="modalTitle"
    :loading="Mloading"
    class-name="vertical-center-modal"
    @on-cancel="cancel">

    <Form  ref="editUserData" :model="editUserData" :rules="ruleValidate" :label-width="80">
      <FormItem label="姓名" prop="name">
        <Input v-model="editUserData.name" name="name" placeholder="输入名字"></Input>
      </FormItem>
      <Form-item label="头像" prop="avatar">
        <uploadSinglePic @on-change="handleUpload" :avatar="editUserData.avatar" width="285px" ref="upload"></uploadSinglePic>
      </Form-item>

      <FormItem label="邮箱" prop="email">
        <Input v-model="editUserData.email" name="email" placeholder="输入邮箱"></Input>
      </FormItem>

      <Form-item label="所属部门">
        <dept-tree-choose width="285px" :deptName="editUserData.deptName" @onDeptchange="onDeptchange" ref="depTree"></dept-tree-choose>
      </Form-item>

      <Form-item label="分配角色">
        <role-tree-choose width="285px" :role_name="editUserData.roleName" @onRolechange="onRolechange" ref="roleTree"></role-tree-choose>
      </Form-item>

      <FormItem label="性别" prop="sex">
        <!-- RadioGroup 的name="sex" 就是key-->
        <RadioGroup  v-model="editUserData.sex">
          <!-- <Radio name="sex"  label="1"></Radio>
           <Radio name="sex"  label="2"></Radio>-->
          <Radio   :label="1" >
            <span>男</span>
          </Radio>
          <Radio   :label="2" >
            <span>女</span>
          </Radio>
        </RadioGroup>
      </FormItem>

    </Form>


    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px"  @click="editModalVisible = false">取消</Button>
      <Button type="primary" @click="handleEdit('editUserData')">确定</Button>
    </div>
  </Modal>

  <Modal
    v-model="showDeleteModal"
    :title="modalTitle"
    class-name="vertical-center-modal"
    @on-ok="sureDelete"
    @on-cancel="cancel">
    {{deleteMessage}}
  </Modal>
</div>


</template>
<script>
  import http from '@/assets/js/public'
  import expandRow from './table-expand.vue';
  import uploadSinglePic from "@/components/common/UploadSinglePic";
  import deptTreeChoose from "@/components/common/DeptTreeChoose";
  import roleTreeChoose from "@/components/common/RoleTreeChoose";

  var sysConfig = require('@/assets/js/sysConfig')
  var preUrl = sysConfig.cmsUrlPre;
  export default {
    components: {
      expandRow,
      uploadSinglePic,
      deptTreeChoose,
      roleTreeChoose
    },
    data () {
      return {
        Mloading:false,
        modalTitle:'',
        preUrl:preUrl,
        modal1:false,
        showDeleteModal:false,
        deleteMessage:'',
        editModalVisible:false,
        userModalVisible: false,
        sureDeleteData:{},
        tableData3: [],//数据格式[{id:1,name:"xxx",sexName:"女",_checked:true}],_checked可以让选中或不选
        showBorder: true,
        showStripe: false,
        showHeader: true,
        showIndex: true,
        showCheckbox: true,
        fixedHeader: false,
        tableSize: 'default',
        totalRecodes:0,
        page:1,
        pageSize:10,
        name:'',
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },

        company:[
          {
            label: '总公司',
            value: '总公司'
          },
          {
            label: '战略部',
            value: '战略部'
          },
          {
            label: '咨询部',
            value: '咨询部'
          }
        ],
        formValidate: {
          id:"",
          sex: 1,
          name: "",
          avatar: "",
          email: "",
          deptid: "",
          account: "",
          password:''
        },
        editUserData: {
          id:"",
          sex: 1,
          name: "",
          avatar: "",
          email: "",
          deptid: "",
          deptName:"",
          roleid:"",
          roleName:""
        },
        ruleValidate: {
          name: [
            { required: true, message: '名字不能为空', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ]
         /* email: [
            { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
            { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
          ]*/
        }
      }
    },
    mounted(){

      this.changePage (1);
      //this.$refs.userTable.$refs.tbody.objData[1]._isChecked = true;
    },
    methods:{
      onRolechange(role){
        this.editUserData.roleid = role.roleid;
        this.editUserData.roleName = role.roleName;
      },
      handleEdit(name){
        this.Mloading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            http.requestPost(preUrl+"/sysUser/updata",this.editUserData).then((data)=>{
              if(data.state === "200"){
                this.$Message.success('修改用户成功!');
                this.Mloading = false;
                this.changePage (this.page);
                this.formValidate={}
              }else {
                this.$Message.error(data.failMsg ? data.failMsg : '修改用户失败!');
                this.Mloading = false;
              }
            },(error)=>{
              this.$Message.error('修改用户失败!');
              this.Mloading = false;
            });

          } else {
            /* var addUserForm = document.getElementById("addUserForm");
             console.log(addUserForm)
             addUserForm.submit()*/
          }
        })
      },
      editUser(user){
        this.modalTitle = '修改用户';
        this.editUserData.id = user.row.id;
        this.editUserData.sex = user.row.sex;
        this.editUserData.name = user.row.name;
        this.editUserData.avatar = user.row.avatar;
        this.editUserData.email = user.row.email;
        this.editUserData.deptid = user.row.deptid;
        this.editUserData.deptName = user.row.deptName;
        this.editUserData.roleid = user.row.roleid;
        this.editUserData.roleName = user.row.roleName;
        this.editModalVisible = true;
      },
      deleteUser(index){
        this.formValidate={}
        http.requestPost(preUrl+"/sysUser/delete",{'userid': index.row.id}).then((data)=>{
          if(data.state === "200"){
            this.$Message.success('删除用户成功!');
            this.changePage (this.page);
            this.formValidate={}
          }else {
            this.$Message.error(data.failMsg ? data.failMsg : '删除用户失败!');
          }
        },(error)=>{
          this.$Message.error('删除用户失败!');
        });
      },


      onDeptchange(deptid){
        this.formValidate.deptid = deptid;
        this.editUserData.deptid = deptid;
      },
      handleAddUser(){
        this.modalTitle = '添加用户';
        this.userModalVisible = true;
      },
      handleUpload(v) {
        this.formValidate.avatar = v;
        this.editUserData.avatar=v;
      },
      searchUser(){
        http.requestGet(preUrl+"/sysUser/list",{page:this.page,size:this.pageSize,keyword:this.name}).then((data)=>{
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
      changeStatus(id ,status,call){
        if(status === 1){
          http.requestPost(preUrl+"/sysUser/unfreeze",{userid : id}).then((data)=>{
            if (data.state === '200'){
              this.$Message.success(data.data);
              call(true);
            }else {
              this.$Message.error(data.failMsg ? data.failMsg : "激活用户失败");
              call(false);
            }
          },(error)=>{
            this.$Message.error("激活用户失败");
            call(false);
          });
        }else if(status === 2){
          http.requestPost(preUrl+"/sysUser/freeze",{userid : id}).then((data)=>{
            if (data.state === '200'){
              this.$Message.warning(data.data);
              call(true);
            }else {
              this.$Message.error(data.failMsg ? data.failMsg : "冻结用户失败");
              call(false);
            }
          },(error)=>{
            this.$Message.error("激活用户失败");
            call(false);
          });
        }


      },
      onPageSizeChange(nowSize){
        this.pageSize = nowSize
        this.changePage(1)
      },
      changePage (page) {
        this.page = page;
        http.requestGet(preUrl+"/sysUser/list",{page:this.page,size:this.pageSize,keyword:this.name}).then((data)=>{
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
      sureDelete () {
        this.deleteUser(this.sureDeleteData)
      },
      cancel () {
        this.Mloading = false;
      },
      handleSubmit (name) {
        this.Mloading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            http.requestPost(preUrl+"/sysUser/add",this.formValidate).then((data)=>{
              if(data.state === "200"){
                this.$Message.success('添加用户成功!');
                this.Mloading = false;
                this.formValidate={}
              }else {
                this.Mloading = false;
                this.$Message.error(data.failMsg?data.failMsg:'添加用户失败!');
              }
            },(error)=>{
              this.Mloading = false;
              this.$Message.error('添加用户失败!');
            });

          } else {
           /* var addUserForm = document.getElementById("addUserForm");
            console.log(addUserForm)
            addUserForm.submit()*/
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      }
    },
    computed: {
      tableColumns3 () {
        let columns = [ {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        }];
        if (this.showCheckbox) {
          columns.push({
            type: 'selection',
            key:'id',
            width: 60,
            align: 'center'
          })
        }
        if (this.showCheckbox) {
          columns.push({
            type: 'html',
            key:'id',
            width: 60,
            align: 'center'
          })
        }
        if (this.showIndex) {
          columns.push({
            type: 'index',
            key:'id',
            title:'序号',
            width: 80,
            align: 'center',
            render:(h,params)=>{
              return h('span',{},params.index+((this.page-1) * this.pageSize));
          }
          })
        }
        columns.push({
          title: '姓名',
          sortable: true,
          align: 'center',
          key: 'name'

        });
        columns.push({
          title: '部门',
          sortable: true,
          align: 'center',
          key: 'deptName',
          filters: this.company,
          filterMethod (value, row) {
            return row.deptName.indexOf(value) > -1;
          }
        });
        columns.push({
          title: '性别',
          sortable: true,
          align: 'center',
          key: 'sexName'
        });
        columns.push({
          title: '状态',
          key: 'status',
          render: (h, params) => {
            const row = params.row;
            const text = row.status === 1 ? true : row.status === 2 ? false : 'Fail';

            return h('i-switch', {
              props: {
                size:'large',
                value:text
              },
              scopedSlots:{
                open:()=>h('span','正常'),
                close:()=>h('span','冻结')
              },
              on:{
                'on-change':(status)=>{
                  status = status ? 1 : 2;
                  var res = this.changeStatus(row.id, status,(res)=>{
                    if(!res){
                      this.changePage (this.page);
                    }
                  });

                }
              }
            });
          }
        });
        columns.push(
          {
            title: '操作',
            key: 'action',
            width: 150,
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
                      this.editUser(params)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      //this.deleteUser(params)
                      //console.log(params.row.name)
                      this.deleteMessage = "确定删除名字为"+params.row.name+"的用户?"
                      this.modalTitle = "请再次确认"
                      this.showDeleteModal = true
                      this.sureDeleteData = params;
                    }
                  }
                }, '删除')
              ]);
            }
          }

        );
        return columns;
      }
    }
  }
</script>
<style scope>
  div.search-input {
    margin-top: 5px !important;
    margin-bottom: 15px !important;
  }
  .ivu-row {
    position: relative;
    margin-left: 0;
    margin-right: 0;
    zoom: 1;
    margin-top: -10px;
    display: block;
  }
  .ivu-col-span-6 {
    display: block;
    margin-top: -8px;
    width: 25%;
  }

  .demo-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }

  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ivu-modal{
    top: 0;
  }

</style>
