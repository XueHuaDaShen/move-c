<template>
  <div class="agent-contact-wrap common">
    <div class="container">
      <div class="card">
        <div class="card-title">
          {{$t('message.contact_agent')}}
        </div>
        <div class="card-body">
          <div class="row important">
            {{$t('message.contact_agent_en')}}
          </div>
          <p class="tl">PHONE：{{phone}}</p>
          <p class="tl mb-20">LINE ID：{{lineid}}</p>
          <!-- <div class="row-line"></div>
          <div class="row">
            <p v-html="$t('message.agent_desc')"></p>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'agentContact',
    components: {},
    props: {},
    data() {
      return {
        phone: localStorage.getItem("candy-superiorphone") != "undefined" ?
          localStorage.getItem("candy-superiorphone") : "",
        lineid: localStorage.getItem("candy-superiorlineid") != "undefined" ?
          localStorage.getItem("candy-superiorlineid") : "",
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {},
    mounted() {},
    methods: {},
  }

</script>

<style lang="scss" scoped>
  .agent-contact-wrap {
    background: #efefef;
    padding: 60px 0;

    .tl {
      text-align: left;
      font-weight: bold;
    }

    .mb-20 {
      margin-bottom: 20px;
    }

    .card-body {
      padding: 60px 20px 40px 20px;

      .row-line {
        background: #EDEDED;
        width: 100%;
        margin-bottom: 20px;
        height: 1px;
      }

      .row {
        margin-bottom: 20px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #191919;
        text-align: left;
        width: 100%;

        &.important {
          color: #191919;
        }
      }
    }
  }

</style>
