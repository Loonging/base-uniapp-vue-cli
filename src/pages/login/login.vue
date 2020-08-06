<template>
  <div>
    <h1>用户登录界面</h1>
    <u-button
      type="primary"
      @click="handleButton">
      前往个人中心
    </u-button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {

    }
  },
  created () {
    uni.setStorageSync('token', true)
  },
  methods: {
    handleButton() {
      this.$router.push({ name: 'index' })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
