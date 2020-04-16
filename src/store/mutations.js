export default {
  ADD_ONE_TAB(state,{tab}){
      state.tabs.push(tab);
  },
  REMOVE_ONE_TAB(state,{tab}){
    state.tabs.splice(tab, 1)
  },
  INIT_LEFT_TABS(state,{tabs}){
    state.leftTabs = tabs;
  },
  REMOVE_ALL_TAB(state){
    state.tabs =[]
  }
}
