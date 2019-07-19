<template>
  <div>
    {{username}}, {{msg}}
  </div>
</template>
<script>
export default {
  name: 'wellcome',
  data() {
    return {
      username: '',
      msg: 'wellcome to King Slot CMS！'
    }
  },
  created() {
    this.username = localStorage.getItem('dove-cms-loginname');
  }
}
</script>
