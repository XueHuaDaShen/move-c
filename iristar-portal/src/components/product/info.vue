<template>
  <div class="product-info limit-width">
    <div class="title"><img :src="product" alt=""></div>
    <div class="product">
      <dl v-if="productItem">
        <dd><img :src="productItem.img" alt=""></dd>
        <dt>
          <h2 class="name">{{productItem.name}}</h2>
          <div class="point">
            <span v-for="(p, pi) in productItem.point" :key="pi">{{p}}</span>
          </div>
          <p class="desc">{{productItem.desc}}</p>
          <ul class="param">
            <li v-for="(item, i) in productItem.param" :key="i">
              <span class="key">{{item.key}}</span>
              <span class="val">{{item.val}}</span>
            </li>
          </ul>
        </dt>
      </dl>
    </div>
  </div>
</template>
<script>
import productList from './productList'
export default {
  name: 'product-info',
  data() {
    return {
      product: require('@/assets/img/title/product.png'),
      list: productList,
      productItem: null,
    }
  },
  created() {
    this.getProduct();
  },
  mounted() {},
  computed: {},
  watch: {
    '$route.query.id': function(n, o) {
      this.getProduct();
    }
  },
  methods: {
    getProduct() {
      let id = this.$route.query.id;
      let product = this.list.filter(item => item.id == id)[0];
      this.productItem = product;
    }
  },
}
</script>
<style lang="scss" scoped>
.product-info{
  width:100%;
  background:#f7f7f7;
  padding:0 .9rem;
  dl{
    display:table;
    padding:.55rem;
    width:100%;
    margin-bottom:.2rem;
    background:#fff;
    dd{
      width:4.3rem;
      margin-top:20%;
      float: left;
      img{
        width:100%;
      }
    }
    dt{
      // width:50%;
      // min-width:555px;
      // padding:0 .2rem;
      padding-left:4.3rem;
      text-align:left;
      // float: left;
      .name{
        font-size:.3rem;
        color:#769bf6;
      }
      .point{
        span{
          color:#769bf6;
        }
        span+span{
          margin-left:.5rem;
        }
      }
      .desc{
        // line-height:22px;
        margin-top:.1rem;
        text-indent: 2em;
      }
      .param{
        margin-top:.8rem;
        width:4.3rem;
        min-width:360px;
        li{
          width:100%;
          border-bottom:1px solid #769bf6;
          display:table;
          padding:.05rem 0;
          span{
            display:block;
            float: left;
          }
          .key{
            min-width:1.4rem;
            text-indent:4px;
          }
          .val{
            max-width:270px;
            white-space: wrap;
          }
        }
      }
    }
  }
}
</style>

