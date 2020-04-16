<template>
  <div>


    <Table ref="roleTable"  :height="fixedHeader ? 250 : ''"  :data="tableData3" :columns="tableColumns3"></Table>

    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="totalRecodes" show-sizer show-elevator :current="page" :page-size="pageSize" @on-change="changePage"  @on-page-size-change="onPageSizeChange"></Page>
      </div>
    </div>

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
      }
    },
    created(){
      this.changePage(1);
    },
    methods:{
     /* initTableData(){
        http.requestGet(preUrl+"/login/log/query",{page:this.page,size:this.pageSize,keyword:this.name}).then(data=>{
          if(data.state === "200"){
            let res = data.data;
            this.tableData3 = res.records;
            this.totalRecodes = res.total;
          }else {
            this.$Message.error(data.failMsg?data.failMsg:"加载失败，请重试")
          }
        },err=>{
          this.$Message.error("加载失败，请重试!")
        })
      },*/
      onPageSizeChange(nowSize){
        this.pageSize = nowSize
        this.changePage(1)
      },
      changePage (page) {
        this.page = page;
        http.requestGet(preUrl+"/login/log/query",{page:this.page,size:this.pageSize}).then((data)=>{
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
          title: '日志信息',
          sortable: true,
          width: 350,
          ellipsis:true,
          align: 'center',
          key: 'message'
        });
        columns.push({
          title: '日志类型',
          sortable: true,
          align: 'center',
          key: 'logname'
        });
        columns.push({
          title: '用户id',
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
        columns.push({
          title: '电脑ip',
          sortable: true,
          align: 'center',
          key: 'ip'
        });

        return columns;
      }
    }

  }
</script>

<style>

</style>
