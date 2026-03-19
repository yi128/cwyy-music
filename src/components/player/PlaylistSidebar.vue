<!-- 播放列表侧边栏 -->
<template>
  <div class="playlist-sidebar" :class="{ 'show': visible }">
    <!-- 遮罩层 -->
    <div class="mask" @click="close"></div>
    
    <!-- 侧边栏内容 -->
    <div class="content">
      <!-- 头部 -->
      <div class="header">
        <h3>播放列表 <span>({{playlist.length}}首)</span></h3>
        <button class="close-btn" @click="close">✕</button>
      </div>
      
      <!-- 列表区域 -->
      <div class="list-container">
        <div 
          class="song-item" 
          v-for="(song,index) in playlist" 
          :key="song.id"
          :class="{ 'active': currentSong?.id === song.id }"
          @click="playSong(song.id)"
        >
          <span>{{index +1}}</span>
          <div class="info">
            <p class="name">{{song.name}}</p>
            <p class="artist">{{formatArtists(song.ar)}}</p>
          </div>
          <button class="delete-btn" @click.stop="clearSong(song.id)">✕</button>
        </div>
      </div>
      
      <!-- 底部 -->
      <div class="footer">
        <button class="clear-btn" @click="clearPlaylist">
          清空列表
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { formatArtists } from '@/utils/format'
import { ElMessage,ElMessageBox } from 'element-plus'
const playerStore = usePlayerStore()
const { playlist, currentSong } = storeToRefs(playerStore)
const isLoading = ref(false)
const props = defineProps<{
  visible:boolean
}>()
const emit = defineEmits(['update:visible'])
const close = () => {
  emit('update:visible',false)
}
// 播放歌曲
const playSong = async (id: number) => {
  // 如果点击的歌曲刚好正在播放，直接返回不要更新播放的信息和进度
  console.log('currentSong',playlist.value)
  if (currentSong.value?.id === id) {
    ElMessage.info('当前歌曲正在播放')
    return 
   }
  try {
    isLoading.value = true
    console.log('用户点击播放', id)
    await playerStore.playSong(id)
  } catch (err) {
    ElMessage.error('播放歌曲失败')
    console.log(err)
  } finally {
    isLoading.value=false
  }
}
// 删除歌曲
const clearSong = (id: string) => {
  playerStore.removeFromPlaylist(id)
  ElMessage.success('删除成功')
}
// 清空播放列表(含确认弹窗)
const clearPlaylist = () => {
  if (playlist.value.length === 0) { 
    ElMessage.info('当前播放列表为空')
    return
  }
  ElMessageBox.confirm(
    '确定要清空整个播放列表吗？', // 提示内容
    '清空列表',                   // 标题
    {
      confirmButtonText: '确定',   // 确认按钮文字
      cancelButtonText: '取消',    // 取消按钮文字
      type: 'warning',             // 图标类型（警告黄色）
      center: true                 // 文字居中
    }
  ).then(() => {
    // 用户点击确定
    playerStore.clearPlaylist()
    ElMessage.success('已清空播放列表')
  }).catch(() => {
    // 用户点击取消
    console.log('取消清空')
  })
}
</script>

<style scoped>
.playlist-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  visibility: hidden;
  transition: visibility 0.3s;
}
.playlist-sidebar.show {
  visibility: visible;
}
.mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition:opacity 0.3s;
}
.show .mask {
  opacity: 1;
}
.content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s;
}
.show .content {
  transform: translateX(0);
}
/* 头部 */
.header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.header h3 span {
  font-size: 14px;
  color: #999;
  margin-left: 5px;
}

.close-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #666;
}

/* 列表区域 */
.list-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.song-item:hover {
  background: #f8f9fa;
}

/* 当前播放歌曲高亮 */
.song-item.active {
  background: #fef2f2;
}

.song-item.active .name {
  color: #ec4141;
}
.index {
  width: 30px;
  color: #999;
  font-size: 14px;
}

.info {
  flex: 1;
}

.name {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.artist {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.delete-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.song-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #f0f0f0;
  color: #ec4141;
}

/* 底部 */
.footer {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}


.clear-btn {
  width: 100%;
  padding: 12px;
  background: white;
  color: #ec4141;
  border: 1px solid #ec4141;
  border-radius: 30px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: #ec4141;
  color: white;
}

/* 空状态样式（以后动态显示用） */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}
</style>