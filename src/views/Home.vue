<template>
  <div class="home-page">
    <div class="banner-wrapper">
      <el-carousel 
        class="banner-section" 
        :height="bannerHeight"
        :autoplay="true"
        :interval="5000"
        indicator-position="none"
        @change="handleBannerChange"
      >
        <el-carousel-item v-for="(b,index) in banners" :key="b.targetId">
          <div 
            class="banner-item"
            :style="{ 
              background: `linear-gradient(90deg, ${bannerColors[index]} 0%, transparent 30%, transparent 80%, ${bannerColors[index]} 100%)`
            }"
          >
            <div class="banner-content">
              <img 
                :src="b.imageUrl" 
                :alt="b.typeTitle" 
                class="banner-img"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
              />
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      
      <!-- 自定义指示器 -->
      <div class="banner-dots">
        <span 
          v-for="(b, index) in banners" 
          :key="b.targetId"
          class="dot"
          :class="{ active: currentBannerIndex === index }"
          @click="currentBannerIndex = index"
        ></span>
      </div>
    </div>
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
            <img :src="i.picUrl" alt="歌单封面" />
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
          <img class="song-img" :src="i.picUrl"></img>
          <div class="song-info">
            <p class="song-name">{{i.name}}</p>
            <p class="song-artist">{{ formatArtists(i.artists) }}</p>
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
import { getRecommendPlaylists, getBanners,getNewSongs } from '@/api/modules/banner'
import type { Song, Playlist, Banner } from '@/types/music'
import { formatArtists, formatCount } from '@/utils/format'
import { getDominantColor } from '@/utils/color'
const router = useRouter()
const playerStore = usePlayerStore()
const recommendPlaylists = ref<Playlist[]>([])
const newSongs = ref<Song[]>([])
const banners = ref<Banner[]>([])
const bannerColors = ref<string[]>([])
const currentBannerIndex = ref(0)
const bannerHeight = '360px'

// 监听轮播图切换
const handleBannerChange = (index: number) => {
  currentBannerIndex.value = index
}
//加载数据
onMounted(async () => {
  try {
      const [playlistsRes, newSongsRes, bannersRes] = await Promise.all ([getRecommendPlaylists(6), getNewSongs(5), getBanners()])
      // 处理轮播图数据
      const processedBanners = bannersRes.data.map((b: any) => ({
        ...b,
        imageUrl: b.bigImageUrl || b.imageUrl
      }))
      banners.value = processedBanners
      const colors = await Promise.all(
        processedBanners.map((b: Banner) => getDominantColor(b.imageUrl))
      )
      bannerColors.value = colors
      recommendPlaylists.value = playlistsRes.data
      newSongs.value = newSongsRes.data
  } catch (err) {
    console.error('加载失败:', err)
  }
})
const viewPlaylist = (id: number) => {
  router.push(`/playlist/${id}`)
  console.log('查看歌单:', id)
}

const playSong = (id: number) => {
  playerStore.playSong(id)
  console.log('播放歌曲:', id)
}

const showMore = () => {
  alert('加载更多...')
}
</script>

<style scoped>
.home-page {
  max-width: 100%;
  margin: 0 auto;
  padding: 10px 20px;
}
/* 轮播图包装器 */
.banner-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

/* 轮播图容器 */
.banner-section {
  width: 100%;
  height: v-bind(bannerHeight);
  --el-carousel-arrow-font-size: 24px;
  --el-carousel-arrow-size: 40px;
  --el-carousel-arrow-background: rgba(0, 0, 0, 0.3);
}

/* 每个轮播项 */
.banner-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #1a1a1a;  /* 基础背景色 */
  transition: background 0.5s ease-in-out;
}

/* 图片容器 */
.banner-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

/* 图片样式 */
.banner-img {
  width: auto;
  height: 100%; 
  max-width: 100%;
  object-fit: contain;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease-in-out;
}

.banner-img:hover {
  transform: scale(1.02);
}

/* 自定义指示器 */
.banner-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1px;
  z-index: 10;
}

.dot {
  width: 40px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
   backdrop-filter: blur(4px);
}

.dot.active {
  width: 50px;
  background-color: #ec4141;
  box-shadow: 0 2px 8px rgba(236, 65, 65, 0.4);
}

.dot:hover {
  background-color: rgba(255, 255, 255, 0.7);
  transform: translateY(-1px);
}
.recommend-section {
  margin: 25px 0;
}
.new-music-section,.recommend-section{
  padding: 0 100px;
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