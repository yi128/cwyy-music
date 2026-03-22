// 添加图片压缩函数
export const compressImage = (url: string, size = 300) => {
    if (!url) return url
    if (url.includes('music.126.net')) {
        return `${url}?param=${size}y${size}`
    }
    return url
}
