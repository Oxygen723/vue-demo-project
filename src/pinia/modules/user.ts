import { ref } from 'vue'
import { defineStore } from 'pinia'
// import router from '../../router'
import { LoginBody } from '../../services/api'

export const useUserStore = defineStore('userStore', () => {
  const userInfo = ref<LoginBody>()

  const clearState = () => {
    userInfo.value = { type: 0, userAccount: '', userPwd: '' };
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  return {
    userInfo,
    clearState
  }
})