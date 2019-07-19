<template>
  <div class="user-tabs mt-30">
    <div class="user-tabs-inner">
      <div class="user-tab-pane" :class="{ active:tab.val === locationName}" @click="handleClick(tab, index, tab.val === locationName)" v-for="(tab,index) in tabs" :key="index">
        <router-link :to="{name: tab.val}">{{$t('message.'+tab.name)}}</router-link>
      </div>
    </div>
    <!-- <div class="user-tabs-wrap">
      <div class="user-tabs-inner">
        <div class="user-tab-pane ml-50" :class="{ active:tab.val === locationName}" @click="handleClick(tab, index)" v-for="(tab,index) in tabs"
          :key="index">
          <router-link :to="{name: tab.val}">{{$t('message.'+tab.name)}}</router-link>
        </div>
      </div>
      <em class="tag" :class="currPage+'tag'+tagClass"></em>
    </div>
    <div class="user-tabs-tag-line">
    </div> -->
  </div>
</template>
<script>
  export default {
    name: 'userTabs',
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
        this.setCurrentAcitve();
        for(let i in this.tabs){
          if(this.tabs[i].val === this.$route.name){
            this.transtionAnimate(i);
          }
        }
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
      handleClick(tab, index, ok) {
        this.tagClass = index;
      },
      transtionAnimate(index) {
        let defaultLeft = 55*index;
        let ele = document.getElementsByClassName('user-tabs-inner')[0];
        let left = ele.scrollLeft;
        if(left >= defaultLeft && index != this.tabs.length-1){
          // if(left >= defaultLeft){
            let st = setInterval(() => {
              left -= 2;
              if(left <= defaultLeft){
                clearInterval(st);
              }
              ele.scrollLeft = left;
            }, 1)
          // }
        }else{
          // if(left <= defaultLeft){
            let st = setInterval(() => {
              left += 2;
              if(left >= defaultLeft){
                clearInterval(st);
              }
              ele.scrollLeft = left;
            }, 1)
          // }
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
