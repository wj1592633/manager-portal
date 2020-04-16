<template>
  <div class="own-space">
    <Card>
      <Tabs :animated="false">
        <TabPane label="基本信息" name="info">
          <Form
            ref="person"
            :model="person"
            :label-width="100"
            label-position="right"
          >
            <FormItem label="用户头像：">
              <div class="demo-upload-list">
                <template>
                  <img :src="userImg">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
                  </div>
                </template>

              </div>
             <!-- <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>-->
              <Modal title="图片预览" v-model="visible">
                <img :src="userImg" v-if="visible" style="width: 100%">
              </Modal>
            </FormItem>
            <FormItem label="用户昵称：">
              <span>{{person.name}}</span>
            </FormItem>

            <FormItem label="性别：">
              <span>{{person.sexName}}</span>
            </FormItem>


            <FormItem label="手机号：">
              <span>{{person.phone}}</span>
             <!-- <div style="display:inline-block;margin-left:20px;font-size:13px;">
                <a @click="showChangeMobile">修改手机号</a>
              </div>-->
            </FormItem>
            <FormItem label="邮箱：">
              <span>{{person.email}}</span>
             <!-- <div style="display:inline-block;margin-left:20px;font-size:13px;">
                <a @click="showChangeEmail">修改邮箱</a>
              </div>-->
            </FormItem>

            <FormItem label="所属部门：">
              <span>{{ person.deptName }}</span>
            </FormItem>
            <FormItem label="角色：">
              <span>{{ person.roleName }}</span>
            </FormItem>
            <FormItem label="生日：">
              <span>{{ person.birthday | YMDFilter }}</span>
            </FormItem>
            <!--<FormItem>
              <Button type="primary" style="width: 100px;margin-right:5px" :loading="saveLoading" @click="saveEdit">保存</Button>
              <Button @click="cancelEditUserInfo">取消</Button>
            </FormItem>-->
          </Form>
        </TabPane>
        <TabPane label="编辑信息" name="edit">暂不支持</TabPane>
      </Tabs>

    </Card>


  </div>
</template>

<script>
  import http from '@/assets/js/public'
  var sysConfig = require('@/assets/js/sysConfig')

  var preUrl = sysConfig.cmsUrlPre;
    export default {
      data(){
        return {
          person: {
            id: "",
            avatar: "",
            name: "",
            sex: "",
            phone: "",
            email: "",
            status: "",
          },
          userImg: require('@/assets/img/avatar1.jpg'),
          defaultList: [
            {
              'name': 'a42bdcc1178e62b4694c830f028db5c0',
              'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
            },
            {
              'name': 'bc7521e033abdd1e92222d733590f104',
              'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
            }
          ],
          imgName: '',
          visible: false,
          uploadList: []
        }
      },
      created(){
        this.getPersonInfo();
      },
      methods:{
        getPersonInfo(){
          //sessionStorage中取，没有的化再查询
          var sessionPerson =sessionStorage.getItem("person");
          if(sessionPerson){
            this.person = JSON.parse(sessionPerson);
            console.log(this.person)
            return;
          }
          http.requestPost(preUrl + "/sysUser/getUser",{}).then(data=>{
            if(data.state === "200"){
              sessionStorage.setItem("person",JSON.stringify(data.data));
              this.person = data.data;
            }else {
              this.$Message.error({
                content: "加载个人信息失败，请刷新重试",
                closable: true,
                duration: 10
              })
            }
          },err=>{
            console.log(err)
          });
        },

        handleView (name) {
          this.imgName = name;
          this.visible = true;
        },
        handleRemove (file) {
          const fileList = this.$refs.upload.fileList;
          this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (res, file) {
          file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
          file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        },
        handleFormatError (file) {
          this.$Notice.warning({
            title: 'The file format is incorrect',
            desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
          });
        },
        handleMaxSize (file) {
          this.$Notice.warning({
            title: 'Exceeding file size limit',
            desc: 'File  ' + file.name + ' is too large, no more than 2M.'
          });
        },
        handleBeforeUpload () {
          const check = this.uploadList.length < 5;
          if (!check) {
            this.$Notice.warning({
              title: 'Up to five pictures can be uploaded.'
            });
          }
          return check;
        }
      },
     /* mounted () {
        this.uploadList = this.$refs.upload.fileList;
      }*/
    }
</script>

<style>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
