export default {
  hasTabByTitle:(state,getters) =>(title)=>{
   state.tabs.forEach((item)=>{
     if(item.title === title){
       return true;
     }
   })
  }
}
