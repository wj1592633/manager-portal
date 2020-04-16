<template>

  <div  v-if="loadingFlag" class="demo-spin-container" style="width: 100%;height: 100%" >
    <Spin size="large" fix></Spin>
  </div>
    <div v-else class="index-vue">
        <!-- 侧边栏 -->
        <aside :class="asideClassName">
            <div class="logo-c">
                <img src="../../assets/logo.png" alt="logo" class="logo">
                <span v-show="isShowAsideTitle">后台管理系统</span>
            </div>

          <Menu ref="asideMenu" theme="dark" width="100%" @on-select="gotoPage"
                accordion :open-names="openMenus" active-name="Home" @on-open-change="menuChange">
                <MenuItem name="Home">
                    <Icon size="18" type="md-home" />
                    <!--<span v-show="isShowAsideTitle">主页33</span>-->
                  <router-link v-show="isShowAsideTitle" to="/index/home" tag="span">主页</router-link>
                </MenuItem>

                <Submenu :name="tab.id" v-for="(tab,index) in leftTabs" :key="tab.id">
                  <template slot="title" >
                    <Icon type="ios-paper"/>
                    <span  v-show="isShowAsideTitle" >{{tab.name}}</span>
                  </template>
                  <!--name属性会传入@on-select="gotoPage",根据name跳转对应得路由。:to="'/index'+subTab.url" 貌似可以删掉，但是留着吧-->
                  <MenuItem v-for="(subTab,index) in tab.subMenus" :name="subTab.tips" :to="'/index'+subTab.url" :key="subTab.id">{{subTab.name}}</MenuItem>

                </Submenu>
            </Menu>
        </aside>

        <!-- 右侧部分 -->
        <section class="sec-right">
            <!-- 头部 -->
            <div class="top-c">
                <header>

                    <div class="h-left">
                        <div class="pointer" @click="isShrinkAside" title="收缩/展开">
                            <Icon type="ios-apps" />
                        </div>
                        <!--<div class="refresh-c" @click="reloadPage" title="刷新当前标签页">
                            <Icon type="md-refresh" />
                        </div>-->
                        <div class="tag-options" title="关闭标签">
                            <Dropdown trigger="click" @on-click="closeTags">
                                <Icon type="ios-options" />
                                <DropdownMenu slot="list">
                                    <DropdownItem name="1">关闭其他标签</DropdownItem>
                                    <DropdownItem name="2">关闭所有标签</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                      <div class="tag-options" @click="lock" title="锁屏">
                        <Icon type="md-lock" />
                      </div>
                    </div>

                    <div class="h-right">
                        <div class="notice-c" @click="info" title="查看新消息">
                          <div ref="noticeanimated">
                            <div :class="{newMsg: hasNewMsg}"></div>
                            <Icon type="ios-notifications-outline" />
                          </div>
                        </div>
                        <div class="user-img-c">
                            <img :src="person.avatar?imgPre+person.avatar:userImg">
                        </div>

                      <Modal v-model="showModal" class-name="vertical-center-modal">
                        <p slot="header" style="color:#f60;text-align:center">
                          <Icon type="ios-information-circle"></Icon>
                          <span>修改密码</span>
                        </p>
                        <div style="text-align:center">
                          <Form  ref="changePwdForm" :model="passwordData" :rules="ruleValidate" :label-width="80">
                            <FormItem label="原始密码" prop="oldPwd">
                              <Input v-model="passwordData.oldPwd" placeholder="输入原来的密码"></Input>
                            </FormItem>
                            <FormItem label="新的密码" prop="newPwd">
                              <Input type="password" v-model="passwordData.newPwd"  placeholder="输入新的密码"></Input>
                            </FormItem>
                            <FormItem label="重复密码" prop="rePwd">
                              <Input type="password" v-model="passwordData.rePwd"  placeholder="重复新的密码"></Input>
                            </FormItem>
                          </Form>
                        </div>
                        <div slot="footer">
                          <Button type="error" size="large" long :loading="modal_loading" @click="changerPassword">确定</Button>
                        </div>
                      </Modal>

                        <Dropdown trigger="click" @on-click="userOperate" @on-visible-change="showArrow">
                            <div class="pointer">
                                <span>{{person.name}}</span>
                                <Icon v-show="arrowDown" type="md-arrow-dropdown"/>
                                <Icon v-show="arrowUp" type="md-arrow-dropup"/>
                            </div>
                            <DropdownMenu slot="list">
                                <!-- name标识符 -->
                                <DropdownItem name="1">修改密码</DropdownItem>
                                <DropdownItem name="2">基本资料</DropdownItem>
                                <DropdownItem divided  name="3">退出登陆</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </header>

                <!-- 动态tabs标签栏 -->

              <ul class="ul-c">
                <li v-for="(item, index) in tabs" :class="{active: isActive(item.name)}" @click="activeTag(index)">
                  <a class="li-a">
                    {{item.text}}
                  </a>
                  <Icon size="16" @click="closeTag(index)" type="md-close" />
                </li>
              </ul>

            </div>
            <!-- 页面主体和头部之间放一个遮罩层分隔开 -->
            <div class="mask"></div>
            <!-- 页面主体 -->
            <div class="main-content">
                <div class="view-c">
                  <transition>
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive"/>
                    </keep-alive>

                  </transition>
                  <transition>
                  <router-view v-if="!$route.meta.keepAlive"/>
                  </transition>
                   <!-- <div class="loading-c" v-show="showLoading">
                        <Spin size="large"></Spin>
                    </div>-->
                </div>
            </div>
        </section>

    </div>

</template>

<script>
  import {mapState,mapGetters} from 'vuex'
  import http from '@/assets/js/public'
  var sysConfig = require('@/assets/js/sysConfig')
  var preUrl = sysConfig.cmsUrlPre;
  /*import $ from 'jquery'

  $(function () {
    $(".ivu-menu-submenu-title").each((i,e)=>{
      $(e).click(()=>{
        //class="sub-menu"
        //<a data-v-1ecf270e="" href="/index/user" target="_self" class="ivu-menu-item" style="padding-left: 43px;">文章管理</a>
        console.log("sub-menu")
        console.log($(e).text())
        $(e).next().append("<a data-v-1ecf270e='' href='#/index/user' target='_self' class='ivu-menu-item' style='padding-left: 43px;'>文章管理33</a>")
      });
    });
    //console.log($(".hou").text())
  });*/

  export default {
    name: 'Index',
    data () {
      const rePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('新的密码不能为空'));
        } else if (value !== this.passwordData.newPwd) {
          callback(new Error('两次输入的密码不相同!'));
        } else {
          callback();
        }
      };
        return {
            modalTitle:'',
            showModal:false,
            loadingFlag:true,
            modal_loading:false,
            imgPre: sysConfig.imgRootPath,
            curTabTitle:"", //null
            openMenus: [], // 要打开的菜单名字 name属性
            menuCache: [], // 缓存已经打开的菜单
            showLoading: false, // 是否显示loading
            hasNewMsg: true, // 是否有新消息
            isShowRouter: true,
            person:{},
            passwordData:{
              oldPwd:"",
              newPwd:"",
              rePwd:""
            },
            ruleValidate: {
              oldPwd: [
                { required: true, message: '请输入原来的密码', trigger: 'blur' }
              ],
              newPwd: [
                { required: true, message: '请输入新的密码', trigger: 'blur' }
              ],
              rePwd: [
                { validator: rePwd, trigger: 'blur' }
              ]
            },
            msgNum: '10', // 新消息条数
            user: '小明', // 用户名
            userImg: require('../../assets/img/avatar1.jpg'), // 用户图片
            // 标签栏         标签标题     路由名称
            // 数据格式 {text: '首页', name: 'Foo'}
           /* tabs: [{text: '首页', name: 'Home'}],*/
            arrowUp: false, // 用户详情向上箭头
            arrowDown: true, // 用户详情向下箭头
            isShowAsideTitle: true, // 是否展示侧边栏内容
            main: "", // null页面主要内容区域
            asideClassName: 'aside-big', // 控制侧边栏宽度变化
            asideArrowIcons: [], // 缓存侧边栏箭头图标 收缩时用
            // 由于iView的导航菜单比较坑 只能设定一个name参数
            // 所以需要在这定义组件名称和标签栏标题的映射表 有多少个页面就有多少个映射条数
            nameToTitle: {
                T1: '表格',
                Password: '修改密码',
                UserInfo: '基本资料',
                Msg: '查看消息',
                Home: '首页'
            }
        }
    },
    created() {
      this.initLeftTabs();
      this.getPersonInfo();

        // 已经为ajax请求设置了loading 请求前自动调用 请求完成自动结束
        // 添加请求拦截器
       /* this.$axios.interceptors.request.use(config => {
            this.showLoading = true
            // 在发送请求之前做些什么
            return config
        }, error => {
            this.showLoading = false
            // 对请求错误做些什么
            return Promise.reject(error)
        })

        // 添加响应拦截器
        this.$axios.interceptors.response.use(response => {
            this.showLoading = false
            // 对响应数据做点什么
            return response
        }, error => {
            this.showLoading = false
            // 对响应错误做点什么
            return Promise.reject(error)
        })


        // 如果直接跳转到指定页面 没有对应的标签页 则添加
        const name = this.$route.name
        if (!this.keepAliveData.includes(name)) {
            this.tabs.push({name, text: this.nameToTitle[name]})
        }
       */
    },
    mounted() {

        this.main = document.querySelector('.sec-right')
        //this.asideArrowIcons = document.querySelectorAll('aside .ivu-icon-ios-arrow-down')
        let w = document.documentElement.clientWidth || document.body.clientWidth
        window.onresize = () => {
            // 可视窗口宽度太小 自动收缩侧边栏
            if (w < 1300 && this.isShowAsideTitle
                && w > (document.documentElement.clientWidth || document.body.clientWidth)) {
                this.shrinkAside()
            }
            w = document.documentElement.clientWidth || document.body.clientWidth
        }
    },
    computed: {
      ...mapState(['tabs','leftTabs']),
      ...mapGetters(['hasTabByTitle']),
        // 需要缓存的路由
        keepAliveData() {
            //把tabs的所有数据的title重新组成一个数组返回
            return this.tabs.map(item => item.name)
        }
    },
    updated(){
      this.initNoticeTips();
    },
    methods: {
      logout(){
        http.requestGet(preUrl+"/auth/logout").then(data=>{
          if(data.state === "200"){
            localStorage.removeItem(sysConfig.accessTokenKey)
            localStorage.removeItem(sysConfig.refreshTokenKey)
            sessionStorage.removeItem("person");
            this.$router.replace({name: 'Login'})
          }else {
            this.$Message.error(data.failMsg?data.failMsg:"退出失败")
          }
        },err=>{
          this.modal_loading =false;
          this.$Message.error("修改密码失败!")
        });
      },
      lock(){
        sessionStorage.setItem("lock","lock")
        let url = this.$route.name;
        console.log(url)
        sessionStorage.setItem("lockurl",url)
        this.$router.replace({name: 'Lock'})
      },
      changerPassword(){
        this.$refs.changePwdForm.validate((valid)=>{
          if(valid){
            this.modal_loading =true;
            http.requestPost(preUrl+"/sysUser/password/update",{'oldPwd':this.passwordData.oldPwd,'newPwd':this.passwordData.newPwd}).then(data=>{
              if(data.state === "200"){
                this.modal_loading =false;
                this.showModal = false;
                this.$Message.success(data.data+",需要重新登陆")
              }else {
                this.modal_loading =false;
                this.$Message.error(data.failMsg?data.failMsg:"修改密码失败")
              }
            },err=>{
              this.modal_loading =false;
              this.$Message.error("修改密码失败!")
            })
          }

        })

      },
      getPersonInfo(){
        //sessionStorage中取，没有的化再查询
        var sessionPerson =sessionStorage.getItem("person");
        if(sessionPerson){
          this.person = JSON.parse(sessionPerson);
          return;
        }
        http.requestPost(preUrl + "/sysUser/getUser",{}).then(data=>{
          if(data.state === "200"){
            this.person = data.data;
            sessionStorage.setItem("person",JSON.stringify(data.data));
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
      initNoticeTips(){
        var noticediv = this.$refs.noticeanimated;
        noticediv.className = 'animated infinite shake slow';
      },
      initLeftTabs(){
        this.loadingFlag = true;
        //查询左侧的tabs数据
        http.requestQuickGet(preUrl+"/menu/list").then((data)=>{
          if(data.state === '200'){
            this.$store.dispatch('initLeftTabs', data.data);
            this.loadingFlag = false;
          }else {
            this.$Message.error({
              content: data.failMsg,
              closable: true,
              duration: 10
            });
          }
        },(error)=>{
          this.$Message.error({
            content: '你的网络环境可能比较差，稍后重试',
            closable: true,
            duration: 10
          });
        });
      },

      //点击MenuItem处理事件
      handleClickMenuItem(data){
        if(data){
          console.log("11111data")
          console.log(data)
         //data值格式是"用户管理,/index/user",切割data
          var arr = data.split(",");
          var tab = {title:arr[0],path:arr[1]};
          if(!this.hasTabByTitle("arr[0]")) {
            this.$store.dispatch('addOneTab', tab);
          }
        }

      },
      // 判断当前标签页是否激活状态,比较路由的path
      isActive(name) {
        return this.$route.name === name
      },

        // 跳转页面 路由名称和参数
      gotoPage(name, params) {
        this.$router.replace({name, params})
        if (!this.keepAliveData.includes(name)) {
          // 如果标签超过8个 则将第一个标签删除
          if (this.tabs.length == 8) {
            this.tabs.shift()
          }
          this.tabs.push({name, text: this.$route.meta.title})
        }
      },
        // 用户操作
        userOperate(name) {
            switch(name) {
                case '1':
                    // 修改密码
                  this.showModal = true;
                    //this.gotoPage('Password')
                    break
                case '2':
                    // 基本资料
                    this.gotoPage('PersonDetails')
                    break
                case '3':
                    this.logout();
                    // 退出登陆
                    break
            }
        },
        // 控制用户三角箭头显示状态
        showArrow(flag) {
            this.arrowUp = flag
            this.arrowDown = !flag
        },
        // 判断
        isShrinkAside() {
            this.isShowAsideTitle? this.shrinkAside() : this.expandAside()
        },
        // 收缩
        shrinkAside() {
            this.asideArrowIcons.forEach(e => {
                e.style.display = 'none'
            })
            this.isShowAsideTitle = false
            this.openMenus = []

            this.$nextTick(() => {
                this.$refs.asideMenu.updateOpened()
            })

            setTimeout(() => {
                this.asideClassName =''
                this.main.style.width = 'calc(100% - 80px)'
            }, 0)
        },
        // 展开
        expandAside() {
            setTimeout(() => {
                this.isShowAsideTitle = true
                this.asideArrowIcons.forEach(e => {
                    e.style.display = 'block'
                })
                this.openMenus = this.menuCache
                this.$nextTick(() => {
                    this.$refs.asideMenu.updateOpened()
                })
            }, 200)
            this.asideClassName = 'aside-big'
            this.main.style.width = 'calc(100% - 220px)'
        },
        // 刷新当前标签页
        reloadPage() {
            let name = this.$route.name
            let index = this.keepAliveData.indexOf(name)

            this.$nextTick(() => {
                if (this.tabs.length) {
                    this.isShowRouter = false
                    this.tabs.splice(index, 1)
                    this.$nextTick(() => {
                        this.tabs.splice(index, 0, {name, text: this.nameToTitle[name]})
                        this.gotoPage(name)
                        this.isShowRouter = true
                    })
                } else {
                    this.isShowRouter = false
                    this.$nextTick(() => {
                        this.tabs.push({name, text: this.nameToTitle[name]})
                        this.gotoPage(name)
                        this.isShowRouter = true
                    })
                }
            })
        },
        // 关闭单个标签
      closeTag(i) {
        let name = this.tabs[i].name
       // this.tabs.splice(i, 1)
        this.$store.dispatch('removeOneTab', i);
        event.stopPropagation()
        // 如果关闭的是当前标签 则激活前一个标签
        // 如果关闭的是第一个标签 则激活后一个标签
        if (this.tabs.length) {
          //当由1个或多个tab存在，并且要删除当前选中的那个
          if (this.isActive(name)) {
            if (i != 0 && i== this.tabs.length) {
              this.gotoPage(this.tabs[i - 1].name)
            } else {
              this.gotoPage(this.tabs[i].name)
            }
          }
        } else {
          // 如果没有标签则跳往首页
          if (name != 'Home') {
            this.gotoPage('Home')
          } else {
            this.reloadPage()
          }
        }

      },
        // 根据路由名称关闭页面
        closeName(name) {
            for (let i = 0, len = this.tabs.length; i < len; i++) {
                if (this.tabs[i].name == name) {
                    this.closeTag(i)
                    break
                }
            }
        },
        // 批量关闭标签
        closeTags(flag) {
            if (flag == 1) {
                // 关闭其他标签
                let curRoute = this.$route.name;
                this.$store.dispatch('removeAllTab');
                this.$store.dispatch('addOneTab',{text: '首页', name: 'Home'});
                this.gotoPage(curRoute)
            } else {
                // 关闭所有标签
              this.$store.dispatch('removeAllTab');
                this.gotoPage('Home')
                //this.reloadPage()
            }
        },
        // 激活标签
        activeTag(i) {
            this.gotoPage(this.tabs[i].name)
        },
        // 消息通知
        info() {
            const self = this
            this.$Notice.info({
                title: `您有${this.msgNum}条消息`,
                render(h) {
                    return h('Button', {
                        attrs: {
                            type: 'info',
                            size: 'small'
                        },
                        on: {
                            click() {
                                // 点击查看跳转到消息页
                                self.gotoPage('NoticeShow')
                                self.hasNewMsg = false,
                                self.msgNum = 0
                            }
                        }
                    }, [
                        '点击查看',
                    ])
                }
            })
        },
        // 菜单栏改变事件
        menuChange(data) {
            this.menuCache = data
        },

    }
}
</script>

<style scoped>
  .v-enter{
    opacity: 0;
    transform: translateX(100%);
  }
  .v-leave-to{
    opacity: 0;
    transform: translateX(-100%);
    position: absolute;
  }
  .v-enter-active,.v-leave-active{
    transition: all 0.5s ease;
  }
  .yourElement {
    animation-duration: 3s;
    animation-delay: 2s;
    animation-iteration-count: infinite;
  }

.index-vue {
    height: 100%;
    display: flex;
    justify-content: space-between;
    color: #666;
}


/* 侧边栏 */
aside {
    min-width: 80px;
    background: #20222A;
    height: 100%;
    transition: all .5s;
    overflow: auto;
}
.logo-c {
    display: flex;
    align-items: center;
    color: rgba(255,255,255,.8);
    font-size: 16px;
    margin: 20px 0;
    justify-content: center;
}
.logo {
    width: 40px;
    margin-right: 10px;
}
.aside-big {
    min-width: 220px;
}


/* 主体页面 */
.sec-right {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: width .5s;
}


/* 主体页面头部 */
.top-c {
    background: rgba(230,230,230,.5);
    width: 100%;
}
header {
    height: 50px;
    border-bottom: none;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    font-size: 14px;
}
header .ivu-icon {
    font-size: 24px;
}
.refresh-c {
    margin: 0 30px;
    cursor: pointer;
}
.h-right {
    display: flex;
    align-items: center;
}
.h-left {
    display: flex;
    align-items: center;
}
.user-img-c img {
    width: 100%;
}
.notice-c {
    cursor: pointer;
    position: relative;
}
.newMsg {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #FF5722;
    right: 0;
    top: 0;
}
.user-img-c {
    width: 34px;
    height: 34px;
    background: #ddd;
    border-radius: 50%;
    margin: 0 40px;
    overflow: hidden;
}
.tag-options {
    margin-left: 25px;
    cursor: pointer;
    position: relative;
}

/* 标签栏 */
.ul-c {
    height: 34px;
    margin-top: 2px;
    background: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    overflow: hidden;
}
.ul-c li {
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    height: 24px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px 5px 2px 3px;
    border: 1px solid #e6e6e6;
}
a {
    color: #666;
    transition: none;
}
.li-a {
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.ul-c .ivu-icon {
    margin-left: 6px;
}
.active {
    background: #409eff;
    border: 1px solid #409eff;
}
.active a {
    color: #fff;
}
.active .ivu-icon {
    color: #fff;
}


/* 主要内容区域 */
.main-content {
    overflow: auto;
    height: 100%;
    width: 100%;
    background: #eee;
    padding: 10px 12px;
}
.view-c {
    position: relative;
    background: #fff;
    padding: 15px;
}
.pointer {
    cursor: pointer;
}

/* loading */
.loading-c {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(255,255,255,.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
.mask {
    position: fixed;
    background: #eee;
    height: 10px;
    width: 100%;
    top: 85px;
    z-index: 10;
}
  .demo-spin-container{
    display: inline-block;
    width: 200px;
    height: 100px;
    position: relative;
    border: 1px solid #eee;
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
