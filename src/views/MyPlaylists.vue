<template>
  <div class="my-playlists-page">
    <div class="page-header">
      <h2>我的歌单</h2>
      
      <!-- 管理按钮 -->
      <div class="header-actions">
        <button 
          v-if="!isManageMode" 
          class="manage-btn" 
          @click="enterManageMode"
        >
          管理
        </button>
        <div v-else class="manage-actions">
          <button class="cancel-btn" @click="exitManageMode">取消</button>
          <button 
            class="delete-btn" 
            @click="batchDeletePlaylists"
            :disabled="selectedPlaylists.length === 0"
          >
            删除 ({{ selectedPlaylists.length }})
          </button>
        </div>
      </div>
    </div>
    
    <!-- 创建歌单按钮 -->
    <div class="create-playlist">
      <button class="create-btn" @click="createMyPlaylist">
        <span class="plus-icon">+</span>
        创建歌单
      </button>
    </div>

    <!-- 我创建的歌单 -->
    <section class="playlist-section">
      <div class="section-header">
        <h3>我创建的歌单</h3>
        <span class="section-count">{{ createdPlaylists.length }}</span>
      </div>
      
      <div v-if="createdPlaylists.length === 0" class="empty-state">
        <p>还没有创建歌单</p>
        <p class="empty-tip">点击上方按钮创建你的第一个歌单吧！</p>
      </div>
      
      <div v-else class="playlist-grid">
        <div 
          v-for="playlist in createdPlaylists"
          :key="playlist.id"
          class="playlist-card"
          :class="{ 'manage-mode': isManageMode, 'selected': selectedPlaylists.includes(playlist.id) }"
          @click="handleCardClick(playlist.id)"
        >
          <!-- 管理模式下显示复选框 -->
          <div v-if="isManageMode" class="checkbox" @click.stop="toggleSelect(playlist.id)">
            <span v-if="selectedPlaylists.includes(playlist.id)" class="checked">✓</span>
          </div>
          
          <div class="card-cover">
            <img :src="playlist.coverImgUrl" :alt="playlist.name" />
            <div class="song-count">{{ playlist.trackCount }}首</div>
          </div>
          <div class="card-info">
            <h4 class="playlist-name">{{ playlist.name }}</h4>
          </div>
        </div>
      </div>
    </section>

    <!-- 收藏的歌单 -->
    <section class="playlist-section">
      <div class="section-header">
        <h3>收藏的歌单</h3>
        <span class="section-count">{{ collectedPlaylists.length }}</span>
      </div>
      
      <div v-if="collectedPlaylists.length === 0" class="empty-state">
        <p>还没有收藏任何歌单</p>
        <p class="empty-tip">去发现音乐，收藏你喜欢的歌单吧！</p>
      </div>
      
      <div v-else class="playlist-grid">
        <div 
          v-for="playlist in collectedPlaylists"
          :key="playlist.id"
          class="playlist-card"
          :class="{ 'manage-mode': isManageMode, 'selected': selectedPlaylists.includes(playlist.id) }"
          @click="handleCardClick(playlist.id)"
        >
          <!-- 管理模式下显示复选框 -->
          <div v-if="isManageMode" class="checkbox" @click.stop="toggleSelect(playlist.id)">
            <span v-if="selectedPlaylists.includes(playlist.id)" class="checked">✓</span>
          </div>
          
          <div class="card-cover">
            <img :src="playlist.coverImgUrl" :alt="playlist.name" />
            <div class="song-count">{{ playlist.trackCount }}首</div>
            <div class="creator-tag">{{ playlist.creator.nickname }}</div>
          </div>
          <div class="card-info">
            <h4 class="playlist-name">{{ playlist.name }}</h4>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCreatedPlaylists, getCollectedPlaylists } from '@/api/index'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Playlist } from '@/types/music'

const router = useRouter()
const userStore=useUserStore()
const createdPlaylists = ref<Playlist[]>([])
const collectedPlaylists = ref<Playlist[]>([])
const loading=ref(false)

// 管理模式相关
const isManageMode = ref(false)
const selectedPlaylists = ref<string[]>([])

// 加载数据
const loadData = async () => {
  loading.value=true
  try {
    const [createdRes, collectedRes] = await Promise.all([
      getCreatedPlaylists(), 
      getCollectedPlaylists()
    ])
    if (createdRes.code === 200) {
      createdPlaylists.value = createdRes.data
    }
    if (collectedRes.code === 200) {
      collectedPlaylists.value = collectedRes.data
    }
  } catch (err) {
    console.error('加载歌单数据失败:', err)
    ElMessage.error('加载歌单数据失败')
  } finally {
    loading.value=false
  }
}
// 监听登录状态变化
watch(() => userStore.isLoggedIn, (newVal) => {
  if (newVal) {
    // 登录的话加载数据
    loadData()
  } else {
    createdPlaylists.value = []
    collectedPlaylists.value = []
    exitManageMode()
  }
})

// 检查歌单名是否重复
const isNameDuplicate = (name: string): boolean => {
  return createdPlaylists.value.some(
    playlist => playlist.name === name
  )
}

// 创建新歌单
const createMyPlaylist = async () => {
  try {
    const { value: name } = await ElMessageBox.prompt(
      '请输入歌单名称',
      '创建新歌单',
      {
        confirmButtonText: '创建',
        cancelButtonText: '取消',
        inputPattern: /^.{1,20}$/,
        inputErrorMessage: '歌单名称不能为空且不超过20个字符'
      }
    )
    
    // 检查重名
    if (isNameDuplicate(name)) {
      ElMessage.warning('歌单名称已存在，请换个名字')
      return
    }
    
    // 创建新歌单对象
    const newPlaylist: Playlist = {
      id: `created_${Date.now()}`,
      name: name,
      coverImgUrl: `https://picsum.photos/200/200?random=${Date.now()}`,
      playCount: 0,
      description: '新建歌单',
      creator: { 
        nickname: '我', 
        avatarUrl: '' 
      },
      trackCount: 0
    }
    createdPlaylists.value.unshift(newPlaylist)
    ElMessage.success('创建成功')
    
  } catch {
    // 用户取消创建
    console.log('取消创建')
  }
}

// 查看歌单详情
const viewPlaylist = (id: string) => {
  router.push(`/playlist/${id}`)
}

// 管理模式相关方法
const enterManageMode = () => {
  isManageMode.value = true
  selectedPlaylists.value = []
}

const exitManageMode = () => {
  isManageMode.value = false
  selectedPlaylists.value = []
}

const toggleSelect = (id: string) => {
  const index = selectedPlaylists.value.indexOf(id)
  if (index === -1) {
    selectedPlaylists.value.push(id)
  } else {
    selectedPlaylists.value.splice(index, 1)
  }
}

const handleCardClick = (id: string) => {
  if (isManageMode.value) {
    toggleSelect(id)
  } else {
    viewPlaylist(id)
  }
}

// 批量删除
const batchDeletePlaylists = async () => {
  if (selectedPlaylists.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedPlaylists.value.length} 个歌单吗？`,
      '批量删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-danger-btn'
      }
    )
    
    // 从 createdPlaylists 中删除选中的歌单
    createdPlaylists.value = createdPlaylists.value.filter(
      playlist => !selectedPlaylists.value.includes(playlist.id)
    )
    
    // 从 collectedPlaylists 中删除选中的歌单
    collectedPlaylists.value = collectedPlaylists.value.filter(
      playlist => !selectedPlaylists.value.includes(playlist.id)
    )
    
    ElMessage.success(`成功删除 ${selectedPlaylists.value.length} 个歌单`)
    exitManageMode()
    
  } catch {
    console.log('取消删除')
  }
}

onMounted(() => { 
  loadData()
})
</script>

<style scoped>
.my-playlists-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.manage-btn {
  padding: 6px 16px;
  background: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.manage-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.manage-actions {
  display: flex;
  gap: 10px;
}

.cancel-btn {
  padding: 6px 16px;
  background: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #f5f5f5;
}

.delete-btn {
  padding: 6px 16px;
  background: #ec4141;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-btn:hover:not(:disabled) {
  background: #d43c3c;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.create-playlist {
  margin-bottom: 30px;
}

.create-btn {
  padding: 8px 20px;
  background: #ec4141;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.create-btn:hover {
  background: #d43c3c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 65, 65, 0.3);
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
}

.playlist-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.section-count {
  font-size: 13px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 12px;
}

.empty-state {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  color: #999;
}

.empty-state p {
  margin: 5px 0;
}

.empty-tip {
  font-size: 13px;
  color: #ccc;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

@media (min-width: 768px) {
  .playlist-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .playlist-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (min-width: 1440px) {
  .playlist-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.playlist-card {
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.playlist-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.playlist-card.manage-mode:hover {
  transform: none;
}

.playlist-card.selected {
  outline: 2px solid #ec4141;
}

.checkbox {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 22px;
  height: 22px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.checkbox .checked {
  color: #ec4141;
  font-size: 16px;
  font-weight: bold;
}

.card-cover {
  position: relative;
  aspect-ratio: 1;
  width: 100%;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-count {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  backdrop-filter: blur(2px);
}

.creator-tag {
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(236, 65, 65, 0.9);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  backdrop-filter: blur(2px);
}

.card-info {
  padding: 10px 0;
}

.playlist-name {
  margin: 0;
  font-size: 13px;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>