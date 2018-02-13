const IS_DEV = process.env.NODE_ENV !== 'production'

export const API_ROOT = IS_DEV ? 'https://api.jkchao.cn/api/' : 'http://localhost:8000/api/'
