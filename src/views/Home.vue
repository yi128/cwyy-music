<template>
  <div class="home-page">
    <!-- 轮播图区域 -->
    <el-carousel class="banner-section">
      < v-for="b in banners" :key="b.id">
      <el-carousel-item v-for="b in banners" :key="b.id">
        <img 
          :src="b?.pic"
          :alt="b.title" 
          class="banner-img"
        >
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <section class="recommend-section">
      <div class="section-header">
        <h3>推荐歌单</h3>
        <span class="more-btn" @click="showMore">更多 ></span>
      </div>
      <div class="playlist-grid">
        <div 
          v-for="i in recommendPlaylists" 
          :key="i.id" 
          class="playlist-card"
          @click="viewPlaylist(i.id)"
        >
          <div class="card-cover">
            <img :src="i.coverImgUrl" alt="歌单封面" />
            <div class="play-count">
              <span>▶ {{ formatCount(i.playCount) }}</span>
            </div>
          </div>
          <p class="card-title">{{i.name}}</p>
        </div>
      </div>
    </section>

    <!-- 最新音乐 -->
    <section class="new-music-section">
      <h3>最新音乐</h3>
      <div class="song-list">
        <div 
          v-for="i in newSongs" 
          :key="i.id" 
          class="song-item"
          @click="playSong(i.id)"
        >
          <img class="song-img" :src="i.album.picUrl"></img>
          <div class="song-info">
            <p class="song-name">{{i.name}}</p>
            <p class="song-artist">{{ formatArtists(i.singer) }}</p>
          </div>
          <div class="song-action">▶</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { getRecommendPlaylists, getNewSongs, getBanners } from '@/api'
import type { Song, Playlist, Banner } from '@/types/music'
import { formatArtists,formatCount } from '@/utils/format'
const router = useRouter()
const playerStore = usePlayerStore()
const recommendPlaylists = ref<Playlist[]>([])
const newSongs = ref<Song[]>([])
const banners = ref<Banner[]>([])
//加载数据
onMounted(async () => {
  try {
      const [playlistsRes, newSongsRes, bannersRes] = await Promise.all([getRecommendPlaylists(6), getNewSongs(5), getBanners()])
      recommendPlaylists.value = playlistsRes.data
      newSongs.value = newSongsRes.data
      banners.value = bannersRes.data
  } catch (err) {
    console.error('加载失败:', err)
  }
})
const viewPlaylist = (id: string) => {
  router.push(`/playlist/${id}`)
  console.log('查看歌单:', id)
}

const playSong = (id: string) => {
  playerStore.playSong(id)
  console.log('播放歌曲:', id)
}

const showMore = () => {
  alert('加载更多...')
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.banner-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
}
.banner-section {
  margin-bottom: 30px;
}

.recommend-section {
  margin: 40px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
}

.more-btn {
  color: #666;
  cursor: pointer;
  font-size: 14px;
}

.more-btn:hover {
  color: #ec4141;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (min-width: 768px) {
  .playlist-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .playlist-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.playlist-card {
  cursor: pointer;
}

.card-cover {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.card-cover img {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 1;
  object-fit: cover;
}

.play-count {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.card-title {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.new-music-section {
  margin-top: 50px;
}

.song-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.song-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
}

.song-item:hover {
  background: #f8f9fa;
}

.song-item:last-child {
  border-bottom: none;
}

.song-img {
  width: 50px;
  height: 50px;
  text-align: center;
}

.song-info {
  flex: 1;
  margin: 0 15px;
}

.song-name {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.song-artist {
  margin: 0;
  color: #888;
  font-size: 14px;
}

.song-action {
  color: #ec4141;
  font-size: 20px;
  padding: 5px;
}
</style>