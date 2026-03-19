<!-- 底部面板 -->
 <template>
  <div class="player-bar">
    <audio
      ref="audioRef"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @canplay="onCanPlay"
    ></audio>
    <div class="player-container">
      <!-- 左侧：歌曲信息 -->
      <div class="player-left">
        <div class="song-cover">
          <img :src="picUrl" alt="专辑封面" />
        </div>
        <div class="song-info">
          <div class="song-name">{{ songName }}</div>
          <div class="song-artist">{{ artists }}</div>
        </div>
      </div>
      
      <!-- 中间：播放控制 -->
      <div class="player-center">
        <div class="control-buttons">
          <button class="control-btn mode-btn" title="播放模式" @click="playerStore.togglePlayMode">
                <!-- 顺序播放 -->
                <font-awesome-icon v-if="playMode === 0" :icon="['fas', 'repeat']" />
                <!-- 单曲循环 -->
                <font-awesome-icon v-if="playMode === 1" :icon="['fas', 'arrow-rotate-right']" />
                <!-- 随机播放 -->
                <font-awesome-icon v-if="playMode === 2" :icon="['fas', 'shuffle']" />
          </button>
          <button class="control-btn" title="上一曲" @click="playerStore.playPrev">
            <el-icon :size="20"><DArrowLeft /></el-icon>
          </button>
          <button class="control-btn play-btn" title="播放/暂停" @click="playerStore.togglePlay">
            <el-icon :size="40">
              <VideoPlay v-if="!playing" />
              <VideoPause v-else />
            </el-icon>
          </button>
          <button class="control-btn" title="下一曲" @click="playerStore.playNext">
            <el-icon :size="20"><DArrowRight /></el-icon>
          </button>
          <button class="control-btn" title="歌词">
            🎤
          </button>
        </div>
        
        <!-- 进度条 -->
        <div class="progress-container">
          <span class="current-time">{{ formatTimeFromSeconds(currentTime)}}</span>
          <div class="progress-bar" @click="onProgressChange">
            <div class="progress-fill" :style="{ width: (currentTime / (duration || 1)) * 100 + '%' }"></div>
            <div class="progress-dot" :style="{ left: (currentTime / (duration || 1)) * 100 + '%' }"></div>
          </div>
          <span class="total-time">{{formatTimeFromSeconds(duration)}}</span>
        </div>
      </div>
      
      <!-- 右侧：附加功能 -->
      <div class="player-right">
        <!--  -->
        <div class="volume-control">
          <button class="volume-btn" title="音量" @click="playerStore.toggleMute">
            {{ muted ? '🔇' : volume > 0.5 ? '🔊' : '🔉' }}
          </button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            :value="volume * 100" 
            class="volume-slider"
            @input="onVolumeInput"
          />
        </div>
        <button class="playlist-btn" @click="showPlaylist = true" title="播放列表">
            📋
            <span class="badge" v-if="playlist.length > 0">{{ playlist.length }}</span>
        </button>
        <PlaylistSidebar v-model:visible="showPlaylist" />
        <div class="other-controls">
          <button class="other-btn" title="音效">
            🎛️
          </button>
          <button class="other-btn" title="更多">
            ⋮
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { formatTimeFromSeconds } from '@/utils/format'
import PlaylistSidebar from '@/components/player/PlaylistSidebar.vue'
import { VideoPlay, VideoPause,DArrowLeft, DArrowRight} from '@element-plus/icons-vue'
const playerStore = usePlayerStore()
const {
  playing,
  currentTime,
  volume,
  muted,
  playMode,
  songName,
  artists,
  picUrl,
  currentSong,
  duration,
  playlist
} = storeToRefs(playerStore)
const audioRef = ref<HTMLAudioElement>()
const showPlaylist = ref(false)
// 监听音乐播放状态
watch(playing, (newVal) => {
  if(!audioRef.value) return
  if (newVal) {
    // 播放音乐
    audioRef.value?.play()
  } else {
    // 暂停音乐
    audioRef.value?.pause()
  }
})
// 监听歌曲切换
watch(currentSong, async(newSong) => {
  if (!newSong?.id || !audioRef.value) return
  // 先重置audio的currentTime
  audioRef.value.currentTime = 0
  // 重置store的currentTime
  playerStore.setCurrentTime(0)
  if (newSong) {
    // 动态导入api模块,避免循环依赖
    const { getSongUrl } = await import('@/api/realApi')
    const res = await getSongUrl(newSong.id)
    if (res.code === 200 && res.data?.url) {
      audioRef.value.src = res.data.url
      console.log('🎵 加载歌曲:', newSong.name)
    }
  }
})
// 监听音量
watch(volume, (newVal) => {
  if (audioRef.value) {
    audioRef.value.volume = newVal
  }
})
// 监听静音
watch(muted, (newVal) => {
  if (audioRef.value) {
    audioRef.value.muted = newVal
  }
})
// 时间更新
const onTimeUpdate = () => {
  if (audioRef.value) {
    playerStore.setCurrentTime(audioRef.value.currentTime)
  }
}
// 网站准备好了，可以播放
const onCanPlay = () => { 
  if (playing.value && audioRef.value) {
    audioRef.value.play()
  }
}
// 播放结束
const onEnded = () => { 
  playerStore.playNext()
}
// 进度条拖动
const onProgressChange = (e: MouseEvent) => {
  const progressBar = e.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  // 计算点击的位置
  const ClientX = e.clientX - rect.left
  // 计算点击的位置占进度条的比例
  const percentage = ClientX / rect.width
  const newTime = duration.value * percentage
  // 更新播放器音频时间
  if (audioRef.value) {
    audioRef.value.currentTime = newTime
  }
  // 更新store中的状态
  playerStore.setCurrentTime(newTime)
}
// 音量条拖动
const onVolumeInput = (e: Event) => {
  const sliderValue = (e.target as HTMLInputElement).value//得到的是字符串
  const value = parseFloat(sliderValue) / 100 //转化为数字进行计算
  // 通过store统一管理
  playerStore.setVolume(value)
}
</script>

<style scoped>
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to right, #1a1a1a, #2a2a2a);
  color: white;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.player-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 30px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 左侧：歌曲信息 */
.player-left {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  min-width: 250px;
}

.song-cover img {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.song-info {
  min-width: 150px;
}

.song-name {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 4px;
  color: #fff;
}

.song-artist {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* 中间：播放控制 */
.player-center {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; 
  height: 40px;
}

.control-btn:hover {
  color:  #ec4141;
  background: rgba(236, 65, 65, 0.1);
}

.control-btn .el-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn {
  width: 40px;
  height: 40px;
  color: #ec4141;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(236, 65, 65, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn:hover {
  color: #ff5555;
  transform: scale(1.05);
}
.mode-btn {
  font-size: 16px;
}

/* 进度条 */
.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 600px;
}

.current-time, .total-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  min-width: 40px;
  font-family: monospace;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  transition: height 0.3s;
}

.progress-bar:hover {
  height: 6px;
}

.progress-fill {
  position: absolute;
  height: 100%;
  background: #ec4141;
  border-radius: 2px;
}

.progress-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #ec4141;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(236, 65, 65, 0.8);
  opacity: 0;
  transition: opacity 0.3s;
}

.progress-bar:hover .progress-dot {
  opacity: 1;
}

/* 右侧：附加功能 */
.player-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  min-width: 250px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s;
}

.volume-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.volume-slider {
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition: height 0.3s;
}

.volume-slider:hover {
  height: 6px;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ec4141;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.volume-slider:hover::-webkit-slider-thumb {
  opacity: 1;
}
.playlist-btn {
  position: relative;  /* 为了 badge 的绝对定位 */
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s;
}

.playlist-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #ec4141;
  color: white;
  font-size: 10px;
  line-height: 16px;
  border-radius: 8px;
  transform: translate(25%, -25%);
}
.other-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.other-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.3s;
}

.other-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
</style>
