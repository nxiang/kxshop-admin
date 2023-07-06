import devConfig from './dev/config'
import prodConfig from './prod/config'
const isProd = process.env.NODE_ENV === 'production'

export default isProd ? prodConfig : devConfig
