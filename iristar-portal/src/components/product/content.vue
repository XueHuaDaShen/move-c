<template>
  <div class="product-content limit-width">
    <div class="title"><img :src="product" alt=""></div>
    <div class="product-list">
      <dl v-for="(item, i) in list" :key="i" :class="item.imgPo">
        <dd><img :src="item.img" alt="" @click="toInfo(item)"></dd>
        <dt>
          <h2 class="name" @click="toInfo(item)">{{item.name}}</h2>
          <div class="point">
            <span v-for="(p, pi) in item.point" :key="pi">{{p}}</span>
          </div>
          <p class="desc" @click="toInfo(item)">{{item.desc}}</p>
          <!-- <div class="fc">
            <div class="fc-inner" v-for="(fc, f) in item.fc" :key="f">
              <span><img :src="fc.img" alt=""></span>
              <em>{{fc.name}}</em>
            </div>
          </div> -->
        </dt>
        <span class="btn" @click="toInfo(item)" v-if="item.btn.show">{{item.btn.text}}</span>
      </dl>
    </div>
  </div>
</template>
<script>
import productList from './productList'
export default {
  name: 'product-content',
  data() {
    return {
      product: require('@/assets/img/title/product.png'),
      list: productList
    }
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
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
.product-content{
  background:#f7f7f7;
  padding:0 .9rem;
  .product-list{
    background:#fff;
    padding:0 .1rem;
    dl{
      display:table;
      padding:.4rem 0;
      width:100%;
      border-bottom:.01rem solid #769bf6;
      margin-bottom:.2rem;
      position: relative;
      dd{
        width:40%;
        img{
          width:100%;
          cursor: pointer;
        }
      }
      dt{
        width:60%;
        padding:0 .4rem;
        text-align:left;
        .name{
          font-size:.3rem;
          color:#769bf6;
          cursor: pointer;
        }
        .point{
          margin:.2rem 0;
          span{
            color:#769bf6;
          }
          span+span{
            margin-left:.5rem;
          }
        }
        .desc{
          line-height:2em;
          margin-top:.1rem;
          text-indent: 2em;
          cursor: pointer;
        }
        .fc{
          text-align:center;
          margin-top:.2rem;
          .fc-inner{
            display:inline-block;
            span{
              display:block;
              width:.5rem;
              height:.5rem;
              background:#333;
              border-radius:5px;
              margin:0 auto;
            }
            em{
              display:block;
              font-style: normal;
              text-align:center;
            }
          }
          .fc-inner+.fc-inner{
            margin-left:.5rem;
          }
        }
      }
        span.btn{
          display:inline-block;
          width:1.2rem;
          height:.4rem;
          background:#769bf6;
          color:#fff;
          margin-top:.4rem;
          text-align: center;
          line-height:.4rem;
          border-radius:8px;
          cursor: pointer;
          // float: right;
          right:.4rem;
          bottom:.4rem;
          position: absolute;
          transition: all .3s;
          &:hover{
            background:none;
            border:1px solid #ccc;
            color:#000;
          }
        }
    }
  }
}
</style>

