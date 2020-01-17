<template>
  <div class="home">
    <banner></banner>
    <technology></technology>
    <product></product>
    <solution></solution>
    <news></news>
    <partner></partner>
  </div>
</template>
<script>
import banner from './banner/banner'
import technology from './technology/technology'
import product from './product/product'
import solution from './solution/solution'
import news from './news/news'
import partner from './partner/partner'
export default {
  name: 'home',
  components: {
    banner,
    technology,
    product,
    solution,
    news,
    partner,
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {},
}
</script>
<style lang="scss" scoped>
</style>

