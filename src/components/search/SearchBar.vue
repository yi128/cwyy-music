<template>
  <div class="search-bar" :class="{ 'focused': isFocused }">
    <!-- 搜索图标 -->
    <span class="search-icon">🔍</span>
    
    <!-- 输入框 -->
    <input 
      type="text"
      v-model="keyword"
      placeholder="搜索歌曲、歌单"
      @focus="isFocused=true"
      @blur="isFocused = false"
      @keyup.enter="handleSearch"
    />
    
    <!-- 清空按钮（默认隐藏） -->
    <button class="clear-btn" v-if="keyword" @click="clearSearch">✕</button>
  </div>
</template>

<script setup lang="ts">
import { ref,watch,onUnmounted } from 'vue'
import router from '@/router'
const keyword = ref('')
const isFocused = ref(false)
const searchTimer = ref()
// 处理搜索：跳转到搜索结果页
const handleSearch = () => {
  // trim 去除首尾空格
  const trimmedKeyword = keyword.value.trim()
  if (trimmedKeyword) {
    console.log(trimmedKeyword)
    router.push(`/search?q=${encodeURIComponent(trimmedKeyword)}`)
  }
}
// 清空搜索框
const clearSearch = () => [
  keyword.value = '',
]
// 监听输入变化，可以添加实时搜索
watch(keyword, (newVal) => {
  // 清除之前的定时器
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
  
  // 设置新的定时器，实现防抖
  searchTimer.value = setTimeout(() => {
    if (newVal.trim()) {
      console.log('实时搜索:', newVal)
      // 这里可以做实时搜索建议
    }
  }, 500)
})
// 组件卸载时清除定时器
onUnmounted(() => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
})
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  width: 300px;
  height: 40px;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 0 15px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

/* 聚焦状态样式 */
.search-bar.focused {
  background: white;
  border-color: #ec4141;
  box-shadow: 0 2px 8px rgba(236, 65, 65, 0.2);
}

.search-icon {
  color: #999;
  margin-right: 8px;
  font-size: 16px;
}

.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
}

.clear-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  padding: 0 5px;
  display: block;
  transition: color 0.3s;
}

.clear-btn:hover {
  color: #ec4141;
}
</style>