interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_USE_REAL_API: string
    // 如果你还有其他环境变量，可以继续添加
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}