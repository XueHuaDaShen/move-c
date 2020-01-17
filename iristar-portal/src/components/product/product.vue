<template>
  <div class="product limit-width">
    <div class="product-bg-img">
      <div class="bg"><img :src="productBj" alt=""></div>
      <div class="inner">
        <img :src="product" alt="">
        <div class="wrap">
          <div class="item" :class="'scale'+item.scale" @click="toInfo(item)" v-for="(item, i) in productData" :key="i">
            <img :src="item.toHomeImg" :alt="item.title" :title="item.title">
          </div>
        </div>
        <span class="knowMore" @click="toMore">了解更多</span>
      </div>
    </div>
  </div>
</template>
<script>
import productList from './productList'
export default {
  name: 'product',
  data() {
    return {
      product: require('@/assets/img/title/product.png'),
      productBj: require('@/assets/img/home/product.jpg'),
      productList: productList,
      productData: [],
    }
  },
  created() {
    this.formatData();
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    formatData() {
      const vm = this;
      let arr = this.productList.filter(v => v.showToHome);
      this.productData = arr.sort(vm.sortByIndex)
    },
    
    // 按索引排序
    sortByIndex(a, b) {
      // 1, 降序; 0, 升序
      let type = 0;
      if(type === 1) {
        return new Date(b.index) - new Date(a.index)
      }
      if(type === 0) {
        return new Date(a.index) - new Date(b.index)
      }
    },
    toMore() {
      this.$router.push({
        name: 'productContent'
      })
    },
    toInfo(item) {
      this.$router.push({
        name: 'productInfo',
        query: {
          id: item.id
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.product{
  padding:.2rem 0;
  .product-bg-img{
    position: relative;
    .bg{
      width:100%;
      opacity: 0;
      img{
        width:100%;
      }
    }
    .inner{
      position: absolute;
      width:100%;
      height:100%;
      left:0;
      top:0;
      .wrap{
        text-align:center;
        margin-top:.8rem;
        .item{
          display:inline-block;
          width:16%;
          transform: scale(0.9);
          margin:0 .2rem;
          cursor: pointer;
          transition: transform .3s;
          &:hover{
            transform: scale(1);
          }
          img{
            width:100%;
          }
        }
        .scale1-1{
          transform: scale(1.1);
          margin:0 .3rem;
          &:hover{
            transform: scale(1.2);
          }
        }
        .scale1-2{
          transform: scale(1.2);
          margin:0 .4rem;
          &:hover{
            transform: scale(1.3);
          }
        }
      }
    }
  }
}
</style>

