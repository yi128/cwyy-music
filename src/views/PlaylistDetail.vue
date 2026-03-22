<template>
  <div class="playlist-detail">
    <!-- 情况一：还没加载完成 -->
    <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
    </div>
    <!-- 情况二：加载失败 -->
    <div v-else-if="error" class="error-state">
        <p class="error-icon">❌</p>
        <p class="error-message">{{ error }}</p>
        <button class="retry-btn" @click="loadData">点击重试</button>
    </div>
    <!-- 情况三：加载成功 -->
    <!-- 歌单头部信息 -->
    <div v-else class="playlist-header">
      <!-- 左侧封面图 -->
      <div class="playlist-cover">
        <img 
          :src="playlistDetail.coverImgUrl" 
          alt="歌单封面"
        >
      </div>
      
      <!-- 右侧信息 -->
      <div class="playlist-info">
        <h1 class="playlist-title">{{ playlistDetail.name }}</h1>
        
        <!-- 创建者信息 -->
        <div class="creator">
          <img 
            :src="playlistDetail.creator.avatarUrl" 
            alt="头像" 
            class="creator-avatar"
          >
          <span class="creator-name">{{ playlistDetail.creator.nickname }}</span>
          <span class="create-time">{{formatDate( playlistDetail.createTime) }} 创建</span>
        </div>
        
        <!-- 歌单描述 -->
        <div class="description-wrapper">
          <p 
            class="description" 
            :class="{ 'expanded': isDescriptionExpanded }"
            :style="{ '-webkit-line-clamp': isDescriptionExpanded ? 'unset' : 2 }"
          >
            {{ playlistDetail.description }}
          </p>
          <button 
            v-if="showDescriptionToggle" 
            class="description-toggle-btn"
            @click="toggleDescription"
          >
            {{ isDescriptionExpanded ? '收起' : '更多' }}
          </button>
        </div>
        <div class="tag" v-if="playlistDetail.tags?.length">
          标签：
          <button v-for="(tag,index) in playlistDetail.tags" :key="index">{{ tag }}</button>
        </div>
        <!-- 按钮区域 -->
        <div class="actions">
          <button class="play-all-btn" @click="playAll">
            <span class="play-icon">▶</span>
            播放全部
          </button>
          <!-- 收藏按钮 -->
          <button 
            class="collect-btn"
            :class="{ 'collected': isCollected }" 
            @click="toggleCollect"
            :disabled="collecting"
          >
            {{ isCollected ? '❤ 已收藏' : '❤ 收藏' }}
          </button>
        </div>
        <!-- 歌单统计 -->
        <div class="stats">
          <span>歌曲数: {{ playlistDetail.trackCount }}</span>
          <span>播放数: {{ formatCount(playlistDetail.playCount) }}</span>
          <span>分享数: {{ formatCount(playlistDetail.shareCount) }}</span>
        </div>
      </div>
    </div>

    <!-- 歌曲列表标题 -->
    <div class="song-list-title">
      <h3>歌曲列表 <span class="song-count">{{ songs.length }}首</span></h3>
    </div>

    <!-- 歌曲列表头部 -->
    <div class="song-list-header">
      <span class="col-index"></span>
      <span class="col-title">歌曲标题</span>
      <span class="col-artist">歌手</span>
      <span class="col-duration">时长</span>
    </div>

    <!-- 歌曲列表 -->
    <div class="song-list">
      <div class="song-item" v-for="(song, index) in songs" :key="song.id" @click="playerStore.playSong(song.id)">
        <span class="col-index">{{ index + 1 }}</span>
        <div class="col-title">
          <span class="song-name">{{ song.name }}</span>
        </div>
        <span class="col-artist">{{ formatArtists(song.ar) }}</span>
        <span class="col-duration">{{ formatTime(song.dt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getPlaylistDetail } from '@/api/modules/playlist'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePlayerStore } from '@/stores/player'
import { useUserStore } from '@/stores/user'
import type { PlaylistDetail, Song } from '@/types/music'
import { formatTime, formatCount, formatArtists, formatDate } from '@/utils/format'

const playerStore = usePlayerStore()
const userStore = useUserStore()
const route = useRoute()
const playlistId = Number(route.params.playlistId)

const playlistDetail = ref<PlaylistDetail>({
  id: 0,
  name: '',
  coverImgUrl: '',
  creator: { nickname: '', avatarUrl: '' },
  description: '',
  trackCount: 0,
  playCount: 0,
  shareCount: 0,
  commentCount: 0,
  subscribed: false,
  tags: [],
  tracks: [],
  createTime: 0,
})

const songs = ref<Song[]>([])
const loading = ref(true)
const error = ref('')
const collecting = ref(false)
// 描述展开/收起状态
const isDescriptionExpanded = ref(false)
const showDescriptionToggle = ref(false)
// 计算属性：判断歌单是否被收藏
const isCollected = computed(() => {
  return userStore.isLoggedIn && userStore.isPlaylistCollected(playlistId)
})
// 检查描述是否需要显示"更多"按钮
const checkDescriptionHeight = () => {
  nextTick(() => {
    // 简单判断：如果描述文字超过 100 个字符就显示按钮
    // 或者根据实际行数判断（更精确）
    const descText = playlistDetail.value.description || ''
    showDescriptionToggle.value = descText.length > 80
  })
}

// 切换描述展开/收起
const toggleDescription = () => {
  isDescriptionExpanded.value = !isDescriptionExpanded.value
}

// 加载歌单详情
const loadData = async () => {
  try {
    loading.value = true
    error.value = ''
    const res = await getPlaylistDetail(playlistId)
    
    if (res.code === 200 && res.data) {
      playlistDetail.value = res.data
      songs.value = res.data.tracks || []
      checkDescriptionHeight()
    } else {
      error.value = "歌单不存在"
    }
  } catch (err) {
    error.value = "加载失败，请重试"
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 收藏/取消收藏歌单
const toggleCollect = async () => {
  // 未登录时，提示登录
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  
  if (collecting.value) return
  collecting.value = true
  
  try {
    let result
    if (isCollected.value) {
      result = await userStore.unsubscribePlaylist(playlistId)
    } else {
      result = await userStore.subscribePlaylist(playlistId)
    }
    
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (err) {
    ElMessage.error('网络错误')
    console.error(err)
  } finally {
    collecting.value = false
  }
}

// 播放全部
const playAll = () => {
  if (songs.value.length === 0) {
    ElMessage.warning("暂无歌曲可播放")
    return
  }
  playerStore.playPlaylist(songs.value)
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* 你的样式保持不变 */
</style>
<style scoped>
.playlist-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 15px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ec4141;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #999;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #ec4141;
}

.error-message {
  margin-bottom: 20px;
  font-size: 16px;
}

.retry-btn {
  padding: 10px 30px;
  background: #ec4141;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #d63e3e;
}
/* 头部区域 */
.playlist-header {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.playlist-cover {
  width: 220px;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.playlist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.playlist-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: #1e1e1e;
}

/* 创建者信息 */
.creator {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.creator-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.creator-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.create-time {
  font-size: 13px;
  color: #999;
  margin-left: 5px;
}

/* 描述区域包装器 */
.description-wrapper {
  position: relative;
  margin-bottom: 20px;
}

/* 描述文字样式 */
.description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  max-width: 600px;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 收起状态：最多2行 */
.description:not(.expanded) {
  -webkit-line-clamp: 2;
}

/* 展开状态：不限制行数 */
.description.expanded {
  -webkit-line-clamp: unset;
  display: block;
}

/* 更多/收起按钮 */
.description-toggle-btn {
  background: none;
  border: none;
  color: #ec4141;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 0 0 0;
  margin-top: 4px;
  transition: color 0.2s;
}

.description-toggle-btn:hover {
  color: #d43c3c;
  text-decoration: underline;
}
.tag{
  margin-bottom:10px;
  color: #666;
}
.tag button {
  margin:0 5px;
  background: white;
  border: 1px solid #ddd;
  border-radius:8px;
}
/* 按钮区域 */
.actions {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.play-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 30px;
  background: #ec4141;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.play-all-btn:hover {
  background: #d63e3e;
}

.play-icon {
  font-size: 18px;
}
/* 收藏按钮样式 */
.collect-btn {
  padding: 12px 30px;
  background: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.collect-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
}
/* 已收藏状态的样式 */
.collect-btn.collected {
  color: #ec4141;           /* 文字变红 */
  border-color: #ec4141;    /* 边框变红 */
  background: #fff0f0;      /* 浅红色背景（可选） */
}
.collect-btn.collected:hover {
  background: #ffe5e5;      /* 悬停时背景加深 */
}
/* 统计信息 */
.stats {
  display: flex;
  gap: 30px;
  font-size: 14px;
  color: #999;
}

/* 歌曲列表标题 */
.song-list-title {
  margin: 40px 0 20px;
}

.song-list-title h3 {
  font-size: 20px;
  color: #1e1e1e;
}

.song-count {
  font-size: 14px;
  color: #999;
  margin-left: 5px;
}

/* 歌曲列表头部 */
.song-list-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
  font-size: 14px;
  color: #666;
  font-weight: 500;
  border-bottom: 1px solid #eaeaea;
}

/* 列表项通用列宽 */
.col-index {
  width: 60px;
  text-align: center;
}

.col-title {
  flex: 3;
}

.col-artist {
  flex: 2;
}

.col-duration {
  width: 100px;
  text-align: center;
}

/* 歌曲列表 */
.song-list {
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.song-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s;
  cursor: pointer;
}

.song-item:hover {
  background: #f8f9fa;
}

.song-item:hover .col-index {
  color: #ec4141;
}

.song-item:last-child {
  border-bottom: none;
}

.song-name {
  font-size: 15px;
  color: #1e1e1e;
  font-weight: 500;
}

.col-artist {
  font-size: 14px;
  color: #888;
}

.col-duration {
  font-size: 14px;
  color: #888;
}
</style>