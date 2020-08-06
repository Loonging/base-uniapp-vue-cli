<template>
  <view class="content">
    <image
      class="logo"
      src="/static/logo.png"></image>
    <view>
      <text class="title">
        {{title}}
      </text>
    </view>
    <u-button
      type="primary"
      @click="handleButton">
      前往个人中心
    </u-button>
    <view>
      <h2>{{mock.title}}</h2>
      <ul>
        <li
          v-for="(item,index) in mock.middle"
          :key="index">
          设备状态： {{item.name}}
          显示值：{{item.value}}
        </li>
      </ul>
    </view>
  </view>
</template>

<script>
import { getMock } from '@api/common'
export default {
  data() {
    return {
      title: 'Hello',
      mock: {}
    }
  },
  onShow() {
    getMock().then(res => {
      this.mock = res.data
    })
  },
  methods: {
    handleButton() {
      this.$router.push({ name: 'me' })
    }
  }
}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
