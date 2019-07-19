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
      msg: 'wellcome to KingLotto CMS！'
    }
  },
  created() {
    this.username = localStorage.getItem('cms-loginname');
  }
}
</script>
