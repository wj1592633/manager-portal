<template>
  <div>


    <Table ref="roleTable"  :height="fixedHeader ? 250 : ''"  :data="tableData3" :columns="tableColumns3"></Table>

    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalRecodes" show-sizer show-elevator :current="page" :page-size="pageSize" @on-change="changePage"  @on-page-size-change="onPageSizeChange"></Page>
      </div>
    </div>

    <Modal
      v-model="modal1"
      :title="logTitle"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>{{logMessage}}</p>
      <p>{{logClassName}}</p>
      <p>{{logMethod}}</p>
    </Modal>
  </div>
</template>

<script>
  import http from '@/assets/js/public'
  var sysConfig = require('@/assets/js/sysConfig')
  var preUrl = sysConfig.cmsUrlPre;

  export default {
    data(){
      return {
        totalRecodes:0,
        page:1,
        pageSize:10,
        name:"",
        tableData3: [],
        modal1:false,
        logTitle:"",
        logMessage:"",
        logClassName:"",
        logMethod:""
      }
    },
    created(){
      this.changePage(1);
    },
    methods:{
      ok(){
      },
      cancel(){
      },
      showLogDetails(data){
       let log = data.row;
       this.logTitle = log.logname
       this.logMessage = log.message;
       this.logClassName = log.classname;
       this.logMethod = log.method;
       this.modal1 = true
      },
      onPageSizeChange(nowSize){
        this.pageSize = nowSize
        this.changePage(1)
      },
      changePage (page) {
        this.page = page;
        http.requestGet(preUrl+"/operation/log/query",{page:this.page,size:this.pageSize}).then((data)=>{
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
    },
    computed: {
      tableColumns3 () {
        let columns = [];
        columns.push({
          title: '日志类型',
          sortable: true,
          align: 'center',
          key: 'logtype'
        });
        columns.push({
          title: '日志名称',
          sortable: true,
          align: 'center',
          key: 'logname'
        });
        columns.push({
          title: '操作用户id',
          sortable: true,
          align: 'center',
          key: 'userid'
        });
        columns.push({
          title: '结果',
          sortable: true,
          align: 'center',
          key: 'succeed'
        });
        columns.push({
          title: '时间',
          sortable: true,
          align: 'center',
          key: 'createtime'
        });
       /* columns.push({
          title: '类名',
          sortable: true,
          align: 'center',
          ellipsis:true,
          key: 'classname'
        });
        columns.push({
          title: '方法',
          sortable: true,
          align: 'center',
          ellipsis:true,
          key: 'method'
        });
        columns.push({
          title: '详情',
          sortable: true,
          width: 350,
          ellipsis:true,
          align: 'center',
          key: 'message'
        });*/

        columns.push(
          {
            title: '操作',
            key: 'action',
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
                      this.showLogDetails(params)
                    }
                  }
                }, '查看详情'),
               /* h('Button', {
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
                }, '删除')*/
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

</style>
