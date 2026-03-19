<template>
  <div class="qr-login">
    <div class="qr-header">
      <h3>扫码登录</h3>
      <button class="close-btn" @click="$emit('cancel')">×</button>
    </div>
    
    <div class="qr-content">
      <div class="qr-container">
        <img v-if="qrUrl" :src="qrUrl" class="qr-image" />
        <div v-else class="qr-loading">
          <div class="loading-spinner"></div>
          <p>加载二维码中...</p>
        </div>
      </div>
      
      <div class="qr-status" :class="statusClass">
        {{ statusText }}
      </div>
      
      <div class="qr-tips">
        <p>1. 打开网易云音乐APP</p>
        <p>2. 点击首页左上角扫一扫</p>
        <p>3. 扫描二维码确认登录</p>
      </div>
      
      <div class="qr-actions">
        <button class="refresh-btn" @click="refreshQrCode" :disabled="loading">
          刷新二维码
        </button>
        <button class="back-btn" @click="$emit('back-to-password')">
          返回密码登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getQrCodeKey, getQrCodeBase64, checkQrStatus } from '@/api/realApi';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['login-success', 'cancel', 'back-to-password']);

const userStore = useUserStore();

const qrKey = ref('');
const qrUrl = ref('');
const statusText = ref('获取二维码中...');
const statusClass = ref('');
const loading = ref(false);
const pollingTimer = ref(null);

// 获取二维码
const fetchQrCode = async () => {
  loading.value = true;
  statusText.value = '获取二维码中...';
  
  try {
    // 1. 获取二维码 key
    const keyRes = await getQrCodeKey();
    console.log('获取到的二维码key:', keyRes);
    
    if (keyRes.code !== 200 || !keyRes.data) {
      throw new Error('获取二维码key失败');
    }
    
    // 保存 key
    qrKey.value = keyRes.data.unikey;
    console.log('保存的key:', qrKey.value);
    
    // 2. 生成二维码URL
    const urlData = await getQrCodeBase64(qrKey.value);
    qrUrl.value = urlData.data;
    
    statusText.value = '请使用网易云APP扫码';
    statusClass.value = 'waiting';
    
    // 3. 开始轮询
    setTimeout(() => {
      startPolling();
    }, 500);
    
  } catch (error) {
    console.error('获取二维码失败:', error);
    statusText.value = '二维码获取失败，请重试';
    statusClass.value = 'error';
    ElMessage.error('获取二维码失败');
  } finally {
    loading.value = false;
  }
};

// 开始轮询
const startPolling = () => {
  // 先清除旧的轮询
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value);
    pollingTimer.value = null;
  }
  
  
  pollingTimer.value = setInterval(async () => {
    if (!qrKey.value) {
      console.log('key为空,停止轮询');
      clearInterval(pollingTimer.value);
      pollingTimer.value = null;
      return;
    }
    
    try {
      const res = await checkQrStatus(qrKey.value);
      
      if (res.code === 800) {
        console.log('二维码过期');
        statusText.value = '二维码已过期，请刷新';
        statusClass.value = 'expired';
        clearInterval(pollingTimer.value);
        pollingTimer.value = null;
      } else if (res.code === 801) {
        statusText.value = '等待扫码...';
        statusClass.value = 'waiting';
      } else if (res.code === 802) {
        statusText.value = '已扫码，请在手机上确认';
        statusClass.value = 'scanning';
      } else if (res.code === 803) {
        console.log('登录成功！停止轮询');
        statusText.value = '登录成功！';
        statusClass.value = 'success';
        
        // 先停止轮询
        clearInterval(pollingTimer.value);
        pollingTimer.value = null;
        // 处理登录
        if (res.cookie) {
          const result = await userStore.handleQrLoginSuccess(res.cookie);
          if (result.success) {
            ElMessage.success('登录成功');
            emit('login-success');
          } else {
            ElMessage.error(result.message ||'登录处理失败');
          }
        }
      }
    } catch (error) {
      console.error('轮询失败:', error);
    }
  }, 2000);
};

// 刷新二维码
const refreshQrCode = async () => {
  // 停止轮询
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value);
    pollingTimer.value = null;
  }
  
  // 清空key
  qrKey.value = '';
  qrUrl.value = '';
  // 重新获取
  await fetchQrCode();
};

// 组件挂载时获取二维码
onMounted(() => {
  fetchQrCode();
});

// 组件卸载时清除轮询
onUnmounted(() => {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value);
    pollingTimer.value = null;
  }
});
</script>

<style scoped>
.qr-login {
  background: white;
  border-radius: 12px;
  width: 360px;
  max-width: 90vw;
  overflow: hidden;
}

.qr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.qr-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  line-height: 1;
  padding: 0;
}

.close-btn:hover {
  color: #666;
}

.qr-content {
  padding: 24px;
  text-align: center;
}

.qr-container {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-loading {
  text-align: center;
  color: #999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 30px auto 10px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ec4141;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.qr-status {
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.qr-status.waiting {
  color: #faad14;
}

.qr-status.scanning {
  color: #1890ff;
}

.qr-status.success {
  color: #52c41a;
}

.qr-status.expired, .qr-status.error {
  color: #f5222d;
}

.qr-tips {
  text-align: left;
  margin-bottom: 20px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.qr-tips p {
  margin: 8px 0;
  font-size: 13px;
  color: #666;
}

.qr-tips p:first-child {
  margin-top: 0;
}

.qr-tips p:last-child {
  margin-bottom: 0;
}

.qr-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.refresh-btn {
  width: 100%;
  padding: 10px;
  background: #ec4141;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.refresh-btn:hover {
  background: #d43c3c;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-btn {
  width: 100%;
  padding: 10px;
  background: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
}
</style>