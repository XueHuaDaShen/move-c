export function reLogin(self) {
  if(self.$store.state.isRelogin){
    return false;
  }else{
    self.$store.dispatch('setIsRelogin', true)
  }
  if(self.$route.name === 'login'){
    return false
  }
  var isOk = confirm(self.$t("message.chong_xin_deng_lu"))
  // console.log(self, isOk)
  // console.log(location)
  if (isOk) {
    // location.href = '/login'
    self.$router.push({
      name: 'login'
    })
    localStorage.removeItem('candy-login');
    localStorage.removeItem('candy-cash');
    localStorage.removeItem('candy-cash_credit');
    localStorage.removeItem('candy-loginname');
    localStorage.removeItem('candy-firstname');
    localStorage.removeItem('candy-lastname');
    localStorage.removeItem('candy-phone');
    localStorage.removeItem('candy-email');
    localStorage.removeItem('candy-superiorphone');
    localStorage.removeItem('candy-superiorlineid');
    localStorage.removeItem('candy-token');
    localStorage.removeItem('candy-loginid');
    sessionStorage.removeItem('th_tag_index');
    sessionStorage.removeItem('th_tag_url');
    sessionStorage.removeItem('noticeShowed');
    self.$store.dispatch("setRouterTagIndex", false);
    // window.location.reload(true);
  }
}
