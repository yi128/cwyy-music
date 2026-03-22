<!-- src/views/SearchResult.vue -->
<template>
  <div class="search-result">
    <!-- 搜索关键词标题 -->
    <h2 class="search-title">
      搜索 "{{ keyword}}"
    </h2>
    
    <!-- 标签切换 -->
    <div class="tabs">
      <button 
        class="tab-item"
        :class="{ active:currentTab==='song' }"
        @click="currentTab='song'"
      >歌曲
      </button>
      <button 
        class="tab-item"
        :class="{ active:currentTab==='playlist' }"
        @click="currentTab='playlist'"
      >歌单
      </button>
      <button 
        class="tab-item"
        :class="{ active:currentTab==='singer' }"
        @click="currentTab='singer'"
      >歌手
      </button>
    </div>
    
    <!-- 歌曲列表 -->
    <div v-if="currentTab === 'song'" class="song-list">
      <div v-if="songs.length === 0" class="empty-state">
          <p>没有找到相关歌曲</p>
      </div>
      <div v-else class="song-item" v-for="(song,index) in songs" :key="song.id" @click="PlayerStore.playSong(song.id)">
        <span class="index">{{ index+1 }}</span>
        <div class="info">
          <p class="name">{{ song.name }}</p>
          <p class="artist">{{ formatArtists(song.artists) }}</p>
        </div>
        <span class="duration">{{ formatTime(song.duration) }}</span>
        <button class="play-btn">▶</button>
      </div>
    </div>
    <div v-else-if="currentTab === 'playlist'">
      <div v-if="playlists.length === 0" class="empty-state">
          <p>没有找到相关歌单</p>
      </div>
      <div v-else class="playlist-item" v-for="playlist in playlists" :key="playlist.id">
        <img :src="playlist.coverImgUrl" class="cover" />
        <div class="info" @click="getPlaylistDetail(playlist)">
          <p class="name">{{playlist.name}}</p>
          <p class="count">{{playlist.trackCount}}张</p>
        </div>
      </div>
    </div>
    <!-- 歌手列表 -->
    <div v-else="currentTab === 'artist'" class="artist-list">
      <div v-if="artists.length === 0" class="empty-state">
        <p>没有找到相关歌手</p>
      </div>
      <div 
        v-else 
        v-for="(artist,index) in artists" 
        :key="artist.id"
        class="artist-item"
      >
        <span class="index">{{ index+1 }}</span>
        <img :src="artist.picUrl" class="artist-avatar" />
        <div class="artist-info">
          <p class="artist-name">{{ artist.name }}</p>
          <p class="artist-desc">{{ artist.alias?.join(' ') || '暂无简介' }}</p>
        </div>
        <span class="artist-count">专辑 {{ artist.albumSize }}首</span>
      </div>
    </div>
    <!-- 加载更多 -->
    <div class="load-more">
      <button class="load-more-btn">加载更多</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {usePlayerStore} from '@/stores/player'
import { formatArtists, formatTime } from '@/utils/format'
import {search} from '@/api/modules/search'
import type { Song, Playlist,Artist} from '@/types/music'
import router from '@/router'
const route = useRoute()
const PlayerStore=usePlayerStore()
const keyword = ref('')
const currentTab = ref('song')
const songs = ref<Song[]>([])
const songTotal=ref(0)
const playlists = ref<Playlist[]>([])
const playlistTotal = ref(0)
const artists = ref<Artist[]>([])
const artistTotal = ref(0)
const loading = ref(false)
// 通用搜索数据
const searchByType = async (type: number) => {
  if(!keyword.value)return
  loading.value = true
  try {
    const res = await search(keyword.value, type, 20)
    if (res.code === 200 && res.data) {
      switch (type) {
        case 1: // 歌曲
          songs.value = res.data.songs || []
          songTotal.value = res.data.total || 0
          break
        case 100: // 歌手
          artists.value = res.data.artists || []
          artistTotal.value = res.data.total || 0
          break
        case 1000: // 歌单
          playlists.value = res.data.playlists || []
          playlistTotal.value = res.data.total || 0
          break
      }
    }
  } catch (err) {
    console.log('搜索失败:',err)
  } finally {
    loading.value=false
  }
}

// 搜索歌曲数据
const searchSongData = () => searchByType(1)
// 搜索歌单数据
const searchPlaylistData = () => searchByType(1000)
// 搜索歌手数据
const searchArtistData = () => searchByType(100)
// 获取歌单详情
const getPlaylistDetail = (playlist: Playlist) => {
  console.log("搜索结果跳转歌单详情",playlist)
  router.push(`/playlist/${playlist.id}`)
}
// 监听路由数据变化
watch(() => route.query.q, newVal => {
  keyword.value = newVal as string || ''
  if (keyword.value) {
    searchSongData()
    searchPlaylistData()
  }
})
onMounted(() => {
  keyword.value = route.query.q as string || ''
  if (keyword.value) {
    searchSongData()
    searchPlaylistData()
    searchArtistData()
  }
  console.log('搜索关键词:', keyword.value)
})
</script>

<style scoped>
.search-result {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.search-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #1e1e1e;
}

/* 标签切换 */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  padding: 10px 20px;
  background: none;
  border: none;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #ec4141;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #ec4141;
}

/* 歌曲列表 */
.song-list {
  background: white;
  border-radius: 12px;
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

.song-item:last-child {
  border-bottom: none;
}

.index {
  width: 40px;
  color: #999;
  font-size: 14px;
}

.info {
  flex: 1;
}

.name {
  margin: 0 0 4px 0;
  font-size: 15px;
  color: #1e1e1e;
  font-weight: 500;
}
.artist {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.duration {
  width: 60px;
  color: #999;
  font-size: 14px;
  margin-right: 15px;
}

.play-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #ec4141;
  color: white;
  font-size: 14px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.song-item:hover .play-btn {
  opacity: 1;
}

.play-btn:hover {
  background: #ff5555;
  transform: scale(1.1);
}
/* 歌单列表 */
.playlist-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
}

.playlist-item:hover {
  background: #f8f9fa;
}

.playlist-item:last-child {
  border-bottom: none;
}

.cover {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
}

.playlist-item .info {
  flex: 1;
}

.playlist-item .name {
  margin: 0 0 4px 0;
  font-size: 15px;
  color: #1e1e1e;
  font-weight: 500;
}

.playlist-item .count {
  margin: 0;
  font-size: 12px;
  color: #999;
}
/* 歌手列表 */
.artist-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.artist-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
}

.artist-item:hover {
  background: #f8f9fa;
}

.artist-item:last-child {
  border-bottom: none;
}

.artist-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.artist-info {
  flex: 1;
}

.artist-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.artist-desc {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.artist-count {
  color: #999;
  font-size: 13px;
  margin-left: 15px;
}
/* 加载更多 */
.load-more {
  text-align: center;
  margin-top: 30px;
}

.load-more-btn {
  padding: 10px 30px;
  background: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
  color: #ec4141;
}
</style>