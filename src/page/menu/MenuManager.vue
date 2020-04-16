<template>
    <div>
     <!-- <div style="margin: 10px" class="search-input">
        <Row> <Col span="5">菜单名称: <Input v-model="name" size="default" style="width: auto" clearable placeholder="请输入角色名称" /></Col>
          <Col span="2"><Button shape="circle"  icon="ios-search" @click="searchMenu"></Button></Col>
        </Row>
      </div>-->

      <Table ref="roleTable"  :height="fixedHeader ? 250 : ''"  :data="tableData3" :columns="tableColumns3"></Table>

      <!--<div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="totalRecodes" show-sizer show-elevator :current="page" :page-size="pageSize" @on-change="changePage"  @on-page-size-change="onPageSizeChange"></Page>
        </div>
      </div>-->

    </div>
</template>

<script>
  import http from '@/assets/js/public'
  var sysConfig = require('@/assets/js/sysConfig')
  var preUrl = sysConfig.cmsUrlPre;

    export default {
      data(){
        return {
          name:"",
          tableData3: [],
        }
      },
      created(){
        this.initTableData();
      },
      methods:{
        searchMenu(){

        },
        initTableData(){
          http.requestQuickGet(preUrl+"/menu/all").then(data=>{
            if(data.state === "200"){
              this.tableData3 = data.data;
            }else {
              this.$Message.error(data.failMsg?data.failMsg:"加载失败，请重试")
            }
          },err=>{
            this.$Message.error("加载失败，请重试!")
          })
        },
        changeStatus(id ,status,call){
          let url = preUrl+"/menu/show/"+id+"/"+status;
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
              title: '菜单编号',
              sortable: true,
              align: 'center',
              key: 'id'
            });
            columns.push({
              title: '菜单名称',
              sortable: true,
              align: 'center',
              key: 'name'
            });
            columns.push({
              title: '上级菜单',
              sortable: true,
              align: 'center',
              key: 'parent'
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
                    close:()=>h('span','隐藏')
                  },
                  on:{
                    'on-change':(status)=>{
                      status = status ? 1 : 2;
                      if(row.id === 105){
                        this.$Message.warning({
                          content: '无效的更改，无权更改该菜单',
                          duration: 3,
                          closable: true
                        });
                        return;
                      }
                      var res = this.changeStatus(row.id, status,(result)=>{
                        //刷新网页
                       //this.$router.go(0)
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

</style>
