/**
 * 从图片URL提取主色调(用于轮播图背景)
 * @param imageUrl 图片地址
 * @returns 返回 rgba 颜色字符串
 */
export const getDominantColor = (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'  // 解决跨域问题
        img.src = imageUrl

        img.onload = () => {
            // 创建 canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            // 设置 canvas 尺寸（采样区域，不用太大）
            canvas.width = 50
            canvas.height = 50
            ctx?.drawImage(img, 0, 0, 50, 50)

            // 获取像素数据
            const imageData = ctx?.getImageData(0, 0, 50, 50)
            if (!imageData) {
                resolve('rgba(236, 65, 65, 0.7)')  // 默认红色
                return
            }

            // 统计颜色出现频率（简化版：取左上角颜色）
            const data = imageData.data
            const r = data[0]
            const g = data[1]
            const b = data[2]

            // 返回带透明度的颜色
            resolve(`rgba(${r}, ${g}, ${b}, 0.7)`)
        }

        img.onerror = () => {
            resolve('rgba(236, 65, 65, 0.7)')  // 加载失败用默认红色
        }
    })
}