<template>
	 <div class="welcome-user">
    <h1>Welcome, {{ userInfos.account === '' ? 'common' : userInfos.account }}!</h1>
    <p>Thank you for joining our system.</p>
    <!-- Here you can add links to other parts of your system -->
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
</script>
<style scoped lang="less">
.welcome-user {
  background:#fff;
  text-align: center;
  padding: 17% 0;
  h1{
    font-size:60px;
    font-weight:bold;
    margin-bottom:2%;
  }
   p{
    font-size:50px;
  }
}
</style>