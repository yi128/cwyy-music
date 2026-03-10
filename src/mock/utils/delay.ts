// src/mock/utils/delay.ts
/**
 * 模拟网络延迟
 * @param ms 延迟毫秒数，默认300-800随机
 */
export const delay = (ms?: number) => {
    const waitTime = ms || Math.floor(Math.random() * 500) + 300
    return new Promise(resolve => setTimeout(resolve, waitTime))
}

// 模拟加载状态
export const withLoading = async <T>(
    promise: Promise<T>,
    loadingCallback?: (loading: boolean) => void
): Promise<T> => {
    loadingCallback?.(true)
    try {
        return await promise
    } finally {
        loadingCallback?.(false)
    }
}