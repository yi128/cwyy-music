<template>
  <div class="search-bar" :class="{ 'focused': isFocused }">
    <!-- 搜索图标 -->
    <span class="search-icon">🔍</span>
    
    <!-- 输入框 -->
    <input 
      type="text"
      v-model="keyword"
      placeholder="搜索歌曲、歌单"
      @focus="hanndleFocus"
      @blur="handleBlur"
      @keyup.enter="handleSearch"
    />
    
    <!-- 清空按钮（默认隐藏） -->
    <button class="clear-btn" v-if="keyword" @click="clearSearch">✕</button>

    <!-- 搜索建议下拉框 -->
    <div class="suggestions-dropdown" v-if="showSuggestions && hasSuggestions">
      <!-- 歌曲建议分组 -->
      <div class="suggestion-group">
        <div class="group-title">🎵 歌曲</div>
        
        <!-- 歌曲 -->
        <div class="suggestion-item" v-for="song in suggestions?.songs" :key="song.id">
          <span class="item-name">{{ song.name }}</span>
          <span class="item-artist"> - {{ formatArtists(song.artists)}}</span>
        </div>
      </div>

      <!-- 歌手建议分组 -->
      <div class="suggestion-group">
        <div class="group-title">👤 歌手</div>
        
        <!-- 歌手 -->
        <div class="suggestion-item" v-for="artists in suggestions?.artists" :key="artists.id" >
          <span class="item-name">{{ artists.name }}</span>
        </div>
      </div>

      <!-- 专辑建议分组 -->
      <div class="suggestion-group">
        <div class="group-title">💿 专辑</div>
        
        <!-- 歌单 -->
        <div class="suggestion-item" v-for="album in suggestions?.albums" :key="album.id">
          <span class="item-name">{{ album.name }}</span>
        </div>
      
      <!-- 歌单建议分组 -->
      </div>
            <div class="suggestion-group">
        <div class="group-title">📋 歌单</div>
        
        <!-- 歌单 -->
        <div 
          class="suggestion-item" 
          v-for="playlist in suggestions?.playlists" 
          :key="playlist.id"
          @click="viewPlaylistDetail(playlist.id as number)"
        >
          <span class="item-name">{{ playlist.name }}</span>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,watch,onUnmounted } from 'vue'
import router from '@/router'
import { searchSuggest } from '@/api/modules/search'
import type { Song, Artist, Album, Playlist } from '@/types/music'
import {formatArtists} from '@/utils/format'
// 关键词
const keyword = ref('')
const showSuggestions = ref(false)
const blurTimer = ref()
// 搜索建议
const suggestions = ref({
  songs:<Song[]> [],
  artists: <Artist[]>[],
  albums: <Album[]>[],
  playlists: <Playlist[]>[]
})
// 是否有建议内容
const hasSuggestions = computed(() => {
  return (
    suggestions.value.songs?.length > 0 ||
    suggestions.value.artists?.length > 0 ||
    suggestions.value.playlists?.length > 0 ||
    suggestions.value.albums?.length > 0
  )
})
const isFocused = ref(false)
const searchTimer = ref()
// 处理搜索：跳转到搜索结果页
const handleSearch = () => {
  // trim 去除首尾空格
  const trimmedKeyword = keyword.value.trim()
  if (trimmedKeyword) {
    router.push(`/search?q=${encodeURIComponent(trimmedKeyword)}`)
    showSuggestions.value = false
  }
}
// 处理聚焦
const hanndleFocus = () => {
  isFocused.value = true
  // 如果已经有建议数据，显示下拉框
  if (hasSuggestions.value) {
    showSuggestions.value = true
  }
}
// 处理失焦（延迟关闭，让点击建议项生效）
const handleBlur = () => {
  blurTimer.value = setTimeout(() => {
    isFocused.value = false
    showSuggestions.value = false
  }, 200)
}
// 清空搜索框
const clearSearch = () => [
  keyword.value = '',
]
// 点击搜索建议跳转对应页面
const viewPlaylistDetail = (id:number) => {
  router.push(`/playlist/${id}`)
}
// 监听输入变化，可以添加实时搜索
watch(keyword, (newVal) => {
  // 清除之前的定时器
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
  
  // 设置新的定时器，实现防抖
  searchTimer.value = setTimeout(async() => {
    if (newVal.trim()) {
      console.log('实时搜索:', newVal)
      // 这里可以做实时搜索建议
      const res = await searchSuggest(newVal)
      suggestions.value=res.data
      showSuggestions.value=true
    }
  }, 500)
  // 只有在聚焦状态下才显示下拉框
  if (isFocused.value) {
    showSuggestions.value = hasSuggestions.value
  }
})
// 组件卸载时清除定时器
onUnmounted(() => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
  if (blurTimer.value) {
    clearTimeout(blurTimer.value)
  }
})
</script>

<style scoped>
.search-bar {
  display: flex;
  position: relative;
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
/* 添加到 style 中 */
.search-container {
  position: relative;
  width: 300px;
}

/* 搜索建议下拉框 */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  padding: 8px 0;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

/* 建议分组 */
.suggestion-group {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-group:last-child {
  border-bottom: none;
}

/* 分组标题 */
.group-title {
  padding: 4px 16px;
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 建议项 */
.suggestion-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

/* 建议项名称 */
.item-name {
  color: #333;
  font-weight: 500;
}

/* 歌手名（仅歌曲需要） */
.item-artist {
  color: #999;
  font-size: 12px;
  margin-left: 4px;
}
</style>