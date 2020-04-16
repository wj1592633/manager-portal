<template>
  <div>
    <Poptip trigger="hover" title="图片预览" placement="right" width="350">
      <Input
        v-model="picUrl"
        @on-change="handleChange"

        style="width:280px"
        clearable
      />
      <div slot="content">
        <img :src="picUrl" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
        <a @click="viewImage=true" style="margin-top:5px;text-align:right;display:block">查看大图</a>
      </div>
    </Poptip>
    <!--:headers="accessToken"-->
    <Upload
      name="avatar"
      :action="uploadFileUrl"
      :headers="tokens"
      :on-success="handleSuccess"
      :on-error="handleError"
      :format="['jpg','jpeg','png','gif','bmp']"
       accept=".jpg, .jpeg, .png, .gif, .bmp"
      :max-size="5120"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="beforeUpload"
      :show-upload-list="false"
      ref="up"
      class="upload"
    >
      <Button :loading="loading" icon="ios-cloud-upload-outline">上传图片</Button>
    </Upload>

    <Modal title="图片预览" v-model="viewImage" :styles="{top: '30px'}" draggable>
      <img :src="picUrl" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
      <div slot="footer">
        <Button @click="viewImage=false">关闭</Button>
      </div>
    </Modal>

  </div>
  <!--
  //父组建这么写
  <Form-item label="头像" prop="avatar">
        <uploadSinglePic @on-change="handleUpload" width="285px" ref="upload"></uploadSinglePic>
      </Form-item>

       methods:{
        handleUpload(v) {
          this.userForm.avatar = v;
         }
       }
      -->

</template>

<script>
  //import { uploadFile } from "@/api/index";
  import axios from "axios"
  import http from '@/assets/js/public'
  var sysConfig = require('@/assets/js/sysConfig')
  var uploadFile = sysConfig.cmsUrlPre+"/sysUser/addPic";

  export default {
    name: "uploadPicInput",
   /* props: {
      //avatar,
      width: {
        type: String,
        default: "200px"
      }
    },*/
   props:['avatar'],
    data() {
      return {
        header:{'Content-Type': 'multipart/form-data'},
        tokens: {},
        picUrl:"",
        fileArray:[],
        loading: false,
        viewImage: false,
        uploadFileUrl: uploadFile
      };
    },
    methods: {
      init() {
        //前后端基于token交互，所以得把请求头设置好，this.tokens会被设置到Upload组件headers中，上传图片时就会带上
        let accessTokenKey = sysConfig.accessTokenKey;
        let refreshTokenKey = sysConfig.refreshTokenKey;
        this.tokens = {
          Authorization: sysConfig.accessTokenPre+localStorage.getItem(accessTokenKey),
          refresh_jwt:localStorage.getItem(refreshTokenKey)
        };

      },
      handleFormatError(file) {
        this.loading = false;
        this.$Notice.warning({
          title: "不支持的文件格式",
          desc:
          "所选文件‘ " +
          file.name +
          " ’格式不正确, 请选择 .jpg .jpeg .png .gif .bmp格式文件"
        });
      },
      handleMaxSize(file) {
        this.loading = false;
        this.$Notice.warning({
          title: "文件大小过大",
          desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
        });
      },
      beforeUpload(file) {
        this.loading = true;
        return true;

        /* console.log('file')
        console.log(file)
        let formData = new FormData();
        //向 formData 对象中添加文件
        formData.append('avatar', file);
       /!* http.requestPost("/cms/sysUser/addPic", {avatar1:formData})*!/
      axios.post("/cms/sysUser/addPic", formData, {
          timeout: 10000,
          withCredentials:true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.fileArray.push(file)*/
      },
      handleSuccess(res, file) {
        this.loading = false;
        console.log('res.data')
        console.log(res)
        console.log(file)
        console.log(res.data)
        if (res.state === '200') {
          file.url = sysConfig.imgRootPath + res.data;
          this.picUrl = sysConfig.imgRootPath + res.data;
          //这个是要在父组建调用本组建时传@on-change=""
          this.$emit("on-change", res.data);
        } else {
          this.$Message.error("上传头像失败")
        }
      },
      handleError(error, file, fileList) {
        this.loading = false;
        this.$Message.error(error.toString());
      },
      handleChange(v) {
        this.$emit("on-change", this.picUrl);
      },
      setPicUrl(v) {
        this.picUrl = v;
        this.$emit("on-change", this.picUrl);
      }
    },
    created() {
      this.init();
      /*console.log('this.avatar')
      console.log(this.avatar)*/
      //this.picUrl = this.avatar;
        /*if(this.picUrl === "/cms"){
          this.picUrl=""
        }*/
    },
    watch:{
      'avatar':function () {
        if(this.avatar !== undefined){
          this.picUrl = sysConfig.imgRootPath + this.avatar;
        }else {
          this.picUrl = ""
        }

      }
    }


  };
</script>

<style scope>
  .upload {
    display: inline-block;
    margin-left: 10px;
  }
</style>
