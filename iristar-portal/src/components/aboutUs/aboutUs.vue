<template>
  <div class="aboutUs limit-width">
    <div class="title"><img :src="about" alt=""></div>
    <div class="content">
      <div class="title-img"><img :src="aboutUs.titleImg" alt=""></div>
      <p class="title-content">{{aboutUs.titleContent}}</p>
      <div class="people-produce">
        <div class="people clear-float">
          <div class="inner" v-for="(per, p) in aboutUs.people" :key="p" @mouseover="changePeople(per.id)">
            <img :src="per.userImg" alt="">
            <div class="mask" :class="tag == per.id ? 'hide' : 'show'"></div>
          </div>
        </div>
        <div class="info" v-show="people">
          <div class="people-info">
            <span class="name">{{people.name}}</span>
            <span class="position">{{people.position}}</span>
          </div>
          <p class="produce">{{people.desc}}</p>
        </div>
      </div>
      <div class="aboutUs-produce">
        <p v-for="(text, t) in aboutUs.produce" :key="t">{{text}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import aboutUs from './aboutUs'
export default {
  name: 'aboutUs',
  data() {
    return {
      aboutUs: aboutUs,
      about: require('@/assets/img/title/about.png'),
      tag: '',
      people: null
    }
  },
  created() {
    let peopleTag = localStorage.getItem('peopleTag') || '1';
    this.tag = peopleTag;
    this.changePeople(this.tag);
  },
  mounted() {
  },
  computed: {},
  watch: {},
  methods: {
    changePeople(tag) {
      this.tag = tag;
      localStorage.setItem('peopleTag', tag)
      this.people = this.aboutUs.people.filter(v => v.id === tag)[0];
    },
  },
}
</script>
<style lang="scss" scoped>
.aboutUs{
  color:#666;
  .content{
    background:#fff;
    padding:.25rem 1rem;
    text-align:left;
  }
  .title-img{
    margin:0 auto;
    margin-bottom:.3rem;
    img{
      width:100%;
    }
  }
  .title-content{
    text-indent: 2em;
    margin-bottom:.8rem;
    text-align:left;
  }
  p{
    line-height:2em;
  }
  .people{
    text-align:center;
    margin-bottom:.3rem;
    .inner{
      display:inline-block;
      width:2rem;
      height:2rem;
      border-radius:50%;
      margin:0 1rem;
      position: relative;
      &:hover{
        .mask{
          display:none;
        }
      }
      img{
        width: 100%;
        height:100%;
      }
      .mask{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #2c2d2a;
        opacity: 0.5;
        // display: block;
        position: absolute;
        z-index: 99;
        top: 0;
        left: 0;
      }
      .show{
        display:block;
      }
      .hide{
        display:none;
      }
    }
  }
  .info{
    min-height:189px;
    background: rgb(24, 71, 146);
    color:#fff;
    padding:15px;
  }
  .people-info{
    text-align:left;
    font-weight: bold;
    margin-bottom:.1rem;
    span{
      display: inline-block;
    }
    .name{
      margin-right:.3rem;
    }
  }
  .produce{
    text-indent: 2em;
  }
  .aboutUs-produce{
    margin-top:.6rem;
    p{
      text-indent: 2em;
    }
    p+p{
      margin-top:.2rem;
    }
  }
  #aboutUs-map{
    width:100%;
    height:500px;
  }
}
</style>

