export default {
  addOneTab({commit},tab){
    //这里的job对象必须再封装成对象，用{}。addOne_Muta是mutations里面的,提交对mutations的请求
    commit('ADD_ONE_TAB',{tab});
  },
  removeOneTab({commit},tab){
    //这里的job对象必须再封装成对象，用{}。addOne_Muta是mutations里面的,提交对mutations的请求
    commit('REMOVE_ONE_TAB',{tab});
  },
  removeAllTab({commit}){
    //这里的job对象必须再封装成对象，用{}。addOne_Muta是mutations里面的,提交对mutations的请求
    commit('REMOVE_ALL_TAB');
  },
  initLeftTabs({commit},tabs){
    commit('INIT_LEFT_TABS',{tabs});
  }
}
