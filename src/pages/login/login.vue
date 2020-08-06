<template>
  <div>
    <h1>用户登录界面</h1>
    <u-button
      type="primary"
      @click="handleButton">
      登录成功，返回首页
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
      this.$Router.push({ name: 'index' })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
