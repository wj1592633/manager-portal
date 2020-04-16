<template>
  <div>
    <div style="margin: 10px" class="search-input">
      <Row> <Col span="5">部门名称: <Input v-model="name" size="default" style="width: auto" clearable placeholder="请输入部门名称" /></Col>
        <Col span="2"><Button shape="circle"  icon="ios-search" @click="searchDept"></Button></Col>
        <Col span="3"><Button shape="circle"  icon="md-add" @click="handleAddDept"> 添加部门</Button></Col>
      </Row>
    </div>

    <Table ref="deptTable"  :height="fixedHeader ? 250 : ''"  :data="tableData3" :columns="tableColumns3"></Table>

    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalRecodes" show-sizer show-elevator :current="page" :page-size="pageSize" @on-change="changePage"  @on-page-size-change="onPageSizeChange"></Page>
      </div>
    </div>



    <!--添加部门的弹窗-->
    <Modal
      v-model="modalVisible"
      :loading="loading"
      :title="modalTitle"
      class-name="vertical-center-modal"
      >

      <Form id="addUserForm"  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="部门简称" prop="simplename">
          <Input v-model="formValidate.simplename"  placeholder="输入部门简称"></Input>
        </FormItem>
        <FormItem label="部门全称" prop="fullname">
          <Input v-model="formValidate.fullname"  placeholder="输入部门全称"></Input>
        </FormItem>


        <Form-item label="上级部门">
          <dept-tree-choose width="285px" :deptName="''" @onDeptchange="onDeptchange" ref="depTree"></dept-tree-choose>
        </Form-item>

        <FormItem label="部门排序" prop="num">
          <InputNumber :max="10" :min="1" v-model="formValidate.num" placeholder="数值越大排序越后" style="width: 280px"></InputNumber>
        </FormItem>
      </Form>

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px"  @click="cancelAdd">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import deptTreeChoose from "@/components/common/DeptTreeChoose";
  import http from '@/assets/js/public'
  var sysConfig = require('@/assets/js/sysConfig')
  var preUrl = sysConfig.cmsUrlPre;

  export default {
    components: {
      deptTreeChoose
    },
    data(){
      return {
        loading:false,
        totalRecodes:0,
        page:1,
        pageSize:10,
        name:"",
        tableData3: [],
        modalVisible:false,
        formValidate: {
          num: "",
          simplename: "",
          fullname: "",
          pid: ""

        },
        editUserData:{},
        ruleValidate: {
          fullname: [
            { required: true, message: '全称不能为空', trigger: 'blur' }
          ],
          pid: [
            { required: true, message: '上级部门不能为空', trigger: 'blur' }
          ]

        }
      }
    },
    created(){
        this.changePage(1);
    },
    methods:{
      cancelAdd(){
        this.modalVisible = false
        this.loading =false;
      },
      handleSubmit(){
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            this.loading = true;
            http.requestPost(preUrl+"/dept/add",this.formValidate).then((data)=>{
              if(data.state === "200"){
                this.$Message.success('添加部门成功!');
                this.loading = false;
                this.formValidate={}
              }else {
                this.loading = false;
                this.$Message.error(data.failMsg?data.failMsg:'添加部门失败!');
              }
            },(error)=>{
              this.loading = false;
              this.$Message.error('添加部门失败!');
            });

          }
        })
      },
      cancel () {
        this.loading = false;
      },
      onDeptchange(deptid){
        this.formValidate.pid = deptid;
        this.editUserData.pid = deptid;
      },
      handleAddDept(){
        this.modalTitle = '添加部门';
        this.modalVisible = true;
      },
      searchDept(){
        this.changePage(1);
      },
      onPageSizeChange(nowSize){
        this.pageSize = nowSize
        this.changePage(1)
      },
      changePage (page) {
        this.page = page;
        http.requestGet(preUrl+"/dept/list/table",{page:this.page,size:this.pageSize,keyword:this.name}).then((data)=>{
          if(data.state === '200'){
            let res = data.data;
            this.tableData3 = res.records;
            this.totalRecodes = res.total;
          }else {
            this.$Notice.error({
              desc: 'The desc will hide when you set render.',
              render: h => {
                return h('span', [
                  data.failMsg?data.failMsg:"查询失败，请重试"
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
        if(id === 24){
          this.$Notice.warning({
            title: '不能更改总公司',
            desc:"无权操作"
          });
          this.changePage(this.page)
          return;
        }
        let url = preUrl+"/dept/status/"+id+"/"+status;
        http.requestQuickGet(url).then(data=>{
          if(data.state === "200"){
            this.$Message.success(data.data?data.data:"操作成功")
            call(true);
          }else {
            this.$Message.error(data.failMsg?data.failMsg:"操作失败，请重试")
            call(false);
          }
        },err=>{
          this.$Message.error("操作失败，请重试!")
          call(false);
        })
      }
    },
    computed: {
      tableColumns3 () {
        let columns = [];
        columns.push({
          title: '部门编号',
          sortable: true,
          align: 'center',
          key: 'id'
        });
        columns.push({
          title: '部门简称',
          sortable: true,
          align: 'center',
          key: 'simplename'
        });
        columns.push({
          title: '部门全称',
          sortable: true,
          align: 'center',
          key: 'fullname'
        });
        columns.push({
          title: '上级部门',
          sortable: true,
          align: 'center',
          key: 'pName'
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
                open:()=>h('span','启用'),
                close:()=>h('span','禁用')
              },
              on:{
                'on-change':(status)=>{
                  status = status ? 1 : 2;
                  var res = this.changeStatus(row.id, status,(result)=>{
                   if(!result){
                     this.changePage (this.page);
                   }
                  });

                }
              }
            });
          }
        });
        return columns;
      }
    }

  }
</script>

<style>
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

</style>
