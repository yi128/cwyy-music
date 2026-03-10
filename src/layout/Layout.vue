<template>
  <div class="app-layout">
    <!-- 顶部Tab导航 -->
    <header class="tab-header">
      <!-- 左侧：Tab导航 -->
      <div class="tabs-container">
        <router-link 
          to="/" 
          class="tab-item" 
          exact-active-class="active"
        >
          <span class="tab-text">发现音乐</span>
        </router-link>
        <router-link 
          to="/my-playlists" 
          class="tab-item" 
          active-class="active"
        >
          <span class="tab-text">我的歌单</span>
        </router-link>
        
        <!-- 可以添加更多Tab -->
        <div class="tab-item" @click="showComingSoon('关注')">
          <span class="tab-text">关注</span>
        </div>
        <div class="tab-item" @click="showComingSoon('商城')">
          <span class="tab-text">商城</span>
        </div>
        <div class="tab-item" @click="showComingSoon('音乐人')">
          <span class="tab-text">音乐人</span>
        </div>
      </div>
      
      <!-- 右侧：搜索和登录区域 -->
      <div class="header-right">
        <!-- 搜索框 -->
        <div class="search-area">
          <SearchBar />
        </div>
        
        <!-- 登录区域 -->
        <div class="user-area">
          <div v-if="!isLoggedIn" class="login-section">
            <button class="login-btn" @click="showLogin = true">登录</button>
            <div class="divider">|</div>
            <button class="register-btn" @click="showRegister = true">注册</button>
          </div>
          <div v-else class="user-info">
            <div class="user-avatar" @click="showUserMenu">
              <img :src="userAvatar" alt="用户头像" />
            </div>
            <div class="user-name">{{ userName }}</div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 底部播放器 -->
    <footer class="player-bar">
      <PlayerBar />
    </footer>
    
    <!-- 登录弹窗 -->
    <div v-if="showLogin" class="modal-overlay" @click.self="showLogin = false">
      <div class="login-modal">
        <div class="modal-header">
          <h3>登录网易云音乐</h3>
          <button class="close-btn" @click="showLogin = false">×</button>
        </div>
        <div class="modal-body">
          <input v-model="loginForm.username" placeholder="手机号/邮箱" class="input-field" />
          <input v-model="loginForm.password" type="password" placeholder="密码" class="input-field" />
          <div class="terms-row">
          <input type="checkbox" />
          <span class="terms-text">同意
            <a href="#">《服务条款》</a>
          </span>
          </div>
            <button class="submit-btn" @click="handleLogin">
              登录
            </button>
          <p class="modal-tip">测试阶段可以直接点击登录</p>
        </div>
      </div>
    </div>
    
    <!-- 注册弹窗 -->
    <div v-if="showRegister" class="modal-overlay" @click.self="showRegister = false">
      <div class="register-modal">
        <div class="modal-header">
          <h3>注册账号</h3>
          <button class="close-btn" @click="showRegister = false">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-tip">开发中... 请直接使用登录功能</p>
          <button class="submit-btn" @click="showRegister = false">知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import SearchBar from '@/components/search/SearchBar.vue'
import PlayerBar from '@/components/player/PlayerBar.vue'
// 用户状态
const isLoggedIn = ref(false)
const userName = ref('')
const userAvatar = ref('https://picsum.photos/32/32?random=1')

// 弹窗状态
const showLogin = ref(false)
const showRegister = ref(false)

// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
})

const showComingSoon = (feature: string) => {
  alert(`${feature} 功能开发中...`)
}

const goToSearch = () => {
  // 可以跳转到搜索页面或显示搜索弹窗
  alert('搜索功能开发中...')
}

const handleLogin = () => {
  // 模拟登录成功
  isLoggedIn.value = true
  userName.value = loginForm.username || '测试用户'
  showLogin.value = false
  
  // 清空表单
  loginForm.username = ''
  loginForm.password = ''
  
  alert('登录成功！')
}

const showUserMenu = () => {
  alert('用户菜单（开发中）')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

/* 顶部Tab导航样式 */
.tab-header {
  height: 70px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.tabs-container {
  display: flex;
  gap: 40px;
  height: 100%;
}

.tab-item {
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  position: relative;
  transition: color 0.3s;
  padding: 0 5px;
}

.tab-item:hover {
  color: #ec4141;
}

.tab-item.active {
  color: #ec4141;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #ec4141;
  border-radius: 2px 2px 0 0;
}

.tab-text {
  padding: 5px 0;
}

/* 右侧区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 30px;
}

.search-area {
  display: flex;
  align-items: center;
}

.search-box {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.search-box:hover {
  background: #e8e8e8;
}

.search-icon {
  color: #666;
  font-size: 14px;
}

.search-text {
  color: #666;
  font-size: 14px;
}

/* 用户区域样式 */
.user-area {
  display: flex;
  align-items: center;
}

.login-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.login-btn, .register-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 0;
  transition: color 0.3s;
}

.login-btn:hover, .register-btn:hover {
  color: #ec4141;
}

.divider {
  color: #ddd;
  font-size: 14px;
}

/* 已登录状态 */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 14px;
  color: #333;
}

/* 内容区域 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

/* 播放器样式 */

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.login-modal, .register-modal {
  background: white;
  border-radius: 8px;
  width: 360px;
  max-width: 90vw;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 24px;
}

/* 输入框样式 */
.input-field {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  margin-bottom: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.input-field:hover {
  border-color: #c0c4cc;
}

.input-field:focus {
  border-color: #ec4141;
  outline: none;
  box-shadow: 0 0 0 2px rgba(236, 65, 65, 0.1);
}

.input-field::placeholder {
  color: #c0c4cc;
}

/* 同意条款行 */
.terms-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 13px;
  color: #606266;
}

.terms-row input[type="checkbox"] {
  margin-right: 8px;
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.terms-text {
  user-select: none;
  cursor: pointer;
}

/* 登录按钮 */
.submit-btn {
  width: 100%;
  height: 40px;
  padding: 0;
  background: #ec4141;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #d43c3c;
}

/* 底部提示 */
.modal-tip {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 注册弹窗 */
.register-modal .modal-body {
  text-align: center;
}
</style>