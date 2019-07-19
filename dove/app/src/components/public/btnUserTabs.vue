<template>
  <div class="btn-user-tabs mt-30">
    <div class="btn-user-tabs-inner">
      <div class="user-tab-pane" :class="{ active:tab.val === locationName}" @click="handleClick(tab, index)" v-for="(tab,index) in tabs" :key="index">
        <router-link :to="{name: tab.val}">{{$t('message.'+tab.name)}}</router-link>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'btnUserTabs',
    data() {
      return {
        tagClass: '0',
      }
    },
    props: {
      tabs: {
        type: Array
      },
      currPage: {
        default: '',
        type: String
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {
      this.setCurrentAcitve();
    },
    watch: {
      '$route' () {
        this.setCurrentAcitve()
      }
    },
    computed: {
      locationName() {
        return this.$route.name;
      }
    },
    methods: {
      
      // handleClick(tab) {
      //   this.$router.push({
      //     name: tab.val
      //   });
      // },
      handleClick(tab, index) {
        this.tagClass = index;
        this.transtionAnimate(index);
      },
      transtionAnimate(index) {
        let defaultLeft = 150;
        let ele = document.getElementsByClassName('btn-user-tabs-inner')[0];
        let left = ele.scrollLeft;
        if(index === 0){
          if(left <= defaultLeft){
            let st = setInterval(() => {
              left -= 2;
              if(left <= 0){
                clearInterval(st);
              }
              ele.scrollLeft = left;
            }, 1)
          }
        }else if(index === this.tabs.length-1){
          if(left <= 0){
            let st = setInterval(() => {
              left += 2;
              if(left >= defaultLeft){
                clearInterval(st);
              }
              ele.scrollLeft = left;
            }, 1)
          }
        }
      },
      setCurrentAcitve() {
        this.tabs.forEach((element, index) => {
          if(element.val === this.locationName){
            this.tagClass = index;
          }
        });
        this.transtionAnimate(Number(this.tagClass))
      },
    }
  }

</script>
<style lang="scss" scoped>

</style>
