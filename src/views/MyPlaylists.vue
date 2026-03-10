<template>
  <div class="my-playlists-page">
    <h2>我的歌单</h2>
    
    <!-- 创建歌单按钮 -->
    <div class="create-playlist">
      <button class="create-btn">
        <span class="plus-icon" @click="createMyPlaylist">+</span>
        创建歌单
      </button>
    </div>

    <!-- 我创建的歌单 -->
    <section class="playlist-section">
      <div class="section-header">
        <h3>我创建的歌单</h3>
        <span class="section-count">3</span>
      </div>

      <div class="playlist-grid">
        <div class="playlist-card">
          <div class="card-cover">
            <img src="https://picsum.photos/200/200?random=1" alt="我喜欢的音乐" />
            <div class="song-count">128首</div>
          </div>
          <div class="card-info">
            <h4 class="playlist-name">我喜欢的音乐</h4>
          </div>
        </div>
      </div>
    </section>

    <!-- 收藏的歌单 -->
    <section class="playlist-section">
      <div class="section-header">
        <h3>收藏的歌单</h3>
        <span class="section-count">4</span>
      </div>

      <div class="playlist-grid">
        <div class="playlist-card">
          <div class="card-cover">
            <img src="https://p1.music.126.net/2rux5LnJey75tm9Md-9D-Q==/2890616070443534.jpg?param=200y200" alt="华语热歌榜" />
            <div class="song-count">50首</div>
            <div class="creator-tag">网易云音乐</div>
          </div>
          <div class="card-info">
            <h4 class="playlist-name">华语热歌榜</h4>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { createPlaylist } from '@/api/index'
const createMyPlaylist =() => {
  
}
</script>

<style scoped>
.my-playlists-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.my-playlists-page h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
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