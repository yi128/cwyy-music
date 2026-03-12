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
          <div v-if="!userStore.isLoggedIn" class="login-section">
            <button class="login-btn" @click="showLogin = true">登录</button>
            <div class="divider">|</div>
            <button class="register-btn" @click="showRegister = true">注册</button>
          </div>
          
          <!-- 已登录状态 - 美化后的用户菜单 -->
          <div 
            v-else 
            class="user-info" 
            @click="showUserMenu = !showUserMenu" 
            ref="userMenuRef"
          >
            <div class="user-avatar">
              <img :src="userStore.userInfo.avatarUrl" alt="用户头像" />
              <span class="avatar-badge"></span>
            </div>
            <span class="user-name">{{ userStore.userInfo.nickname }}</span>
            <span class="arrow" :class="{ 'arrow-up': showUserMenu }">▼</span>
            
            <!-- 美化后的下拉菜单 -->
            <transition name="dropdown">
              <div v-if="showUserMenu" class="user-dropdown">
                <div class="dropdown-header">
                  <div class="header-info">
                    <p class="user-nickname">{{ userStore.userInfo.nickname }}</p>
                    <p class="user-phone">{{ userStore.userInfo.phone }}</p>
                  </div>
                </div>
                
                <div class="dropdown-menu">
                  <div class="menu-item" @click.stop="goToMyPlaylists">
                    <span class="menu-icon">📋</span>
                    <span>我的歌单</span>
                  </div>
                  <div class="menu-item" @click.stop="goToProfile">
                    <span class="menu-icon">👤</span>
                    <span>个人资料</span>
                  </div>
                  <div class="menu-item" @click.stop="goToSettings">
                    <span class="menu-icon">⚙️</span>
                    <span>设置</span>
                  </div>
                  <div class="menu-divider"></div>
                  <div class="menu-item logout" @click.stop="handleLogout">
                    <span class="menu-icon">🚪</span>
                    <span>退出登录</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view @open-login="showLogin = true" />
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
          <input 
            v-model="loginForm.username" 
            placeholder="手机号" 
            class="input-field"
            type="tel"
            maxlength="11"
          />
          <input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="密码" 
            class="input-field"
            @keyup.enter="handleLogin" 
          />
          <!-- 测试账号 -->
          <div class="quick-fill">
            <button class="fill-btn" @click="loginForm.username = '13800138000'; loginForm.password = '123456'">测试账号1</button>
            <button class="fill-btn" @click="loginForm.username = '13900139000'; loginForm.password = '123456'">测试账号2</button>
          </div>
          <div class="terms-row">
            <input type="checkbox" v-model="agreeTerms" />
            <span class="terms-text">同意
              <a href="#">《服务条款》</a>
            </span>
          </div>
          <button 
            class="submit-btn"
            @click="handleLogin"
            :disabled="!agreeTerms || !loginForm.username || !loginForm.password"
          >
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
import { ref, reactive, onMounted } from 'vue'
import SearchBar from '@/components/search/SearchBar.vue'
import PlayerBar from '@/components/player/PlayerBar.vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

// 菜单状态
const showUserMenu = ref(false)
const userMenuRef = ref()

// 弹窗状态
const showLogin = ref(false)
const showRegister = ref(false)

// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
})

// 同意条款
const agreeTerms = ref(false)

const showComingSoon = (feature: string) => {
  alert(`${feature} 功能开发中...`)
}

const handleLogin = () => {
  userStore.login(loginForm.username, loginForm.password)
  showLogin.value = false
  
  // 清空表单
  loginForm.username = ''
  loginForm.password = ''
  agreeTerms.value = false
  
  ElMessage.success('登录成功!')
}

// 点击外部关闭菜单
onClickOutside(userMenuRef, () => {
  showUserMenu.value = false
})

// 恢复登录状态
onMounted(() => {
  userStore.restoreLogin()
})

const goToMyPlaylists = () => {
  router.push('/my-playlists')
  showUserMenu.value = false
}

const goToProfile = () => {
  alert('个人资料（开发中）')
  showUserMenu.value = false
}

const goToSettings = () => {
  alert('设置功能开发中')
  showUserMenu.value = false
}

const handleLogout = () => {
  userStore.logout()
  showUserMenu.value = false
  ElMessage.success('已退出登录')
  router.push('/')
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

/* 已登录状态 - 美化后的样式 */
.user-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 4px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  background: transparent;
}

.user-info:hover {
  background: #f5f5f5;
}

.user-avatar {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ec4141;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
  border: 2px solid white;
}

.user-name {
  font-size: 14px;
  color: #333;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  font-size: 12px;
  color: #999;
  transition: transform 0.3s;
}

.arrow-up {
  transform: rotate(180deg);
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 下拉菜单样式 */
.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 1000;
}

.user-dropdown::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 20px;
  width: 12px;
  height: 12px;
  background: white;
  transform: rotate(45deg);
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.04);
}

.dropdown-header {
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #f0f0f0;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-nickname {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.user-phone {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.dropdown-menu {
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #ec4141;
}

.menu-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.menu-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
}

.menu-item.logout {
  color: #999;
}

.menu-item.logout:hover {
  background: #fff0f0;
  color: #ec4141;
}

/* 内容区域 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

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

/* 测试账号快捷填充 */
.quick-fill {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.fill-btn {
  flex: 1;
  padding: 8px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.fill-btn:hover {
  background: #e8e8e8;
  color: #ec4141;
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

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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