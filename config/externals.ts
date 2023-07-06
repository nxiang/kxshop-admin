const env = process.env.NODE_ENV
const isProd = env === 'production'
const isDev = env === 'development'

const configs = {
  // v18.2.0
  react: {
    global: 'window React',
    development:
      'https://kxgcommon.kxll.com/96eaee2b52031aa9/externals/109910/c8712b7904d261aa/9f1d79d325e57b10/82170feba3625e9f/794bd44c685120e0/f43c3d09e6603787/c6d7b1ec15988949/f62b2183064dcfdb/2588783d56906d2c/96230f167238998d.js',
    production:
      'https://kxgcommon.kxll.com/ea116c1e961dedc9/externals/10737/c71e33ade5dccdd1/b1ae0c9ace779471/e817fa7892e67466/3e9176b314591f96/58356aa102af0ab4/0e237de0cdebf375/dd321548d3cceea9/0184f0b926116238/e5cfb95a147bc733.js',
    // 生效环境，仅生产环境生效，因为所有页面都有用到，不externals，提示对开更友好
    envs: [isProd]
  },
  // v18.2.0
  'react-dom': {
    global: 'window ReactDOM',
    development:
      'https://kxgcommon.kxll.com/8ed9c9295e090c41/externals/1077022/b5e417ba92eff322/0b00f116ef553a5c/b34cd43d14b092ba/c51b48b2a401c84f/b45613dca24fb56f/f13a6b6958eddbd1/bd5c2a4f17886f4e/41dfda0d8cdeb135/d9aac2f5ab16684e.js',
    production:
      'https://kxgcommon.kxll.com/9a25a74de36a7b53/externals/131882/8810cb1470663425/d2e07569310d9c5c/7c1089822b1e6ef9/70678ac9d8f76237/be151afeb246f060/b69dfb2444c5d881/72c62d67e5a76de2/452d30b1196e3c06/0c56223c888c9024.js',
    // 生效环境，仅生产环境生效，因为所有页面都有用到，不externals，提示对开更友好
    envs: [isProd]
  },
  // // v0.2.6
  'oss-operate': {
    global: 'window OssOperate',
    development:
      'https://kxgcommon.kxll.com/4d471c84a21eb82d/externals/1773997/af07e223d7a66722/1981f894dcc6dc37/9799ca19dffec410/9370fa8a5595b8a6/33f9966f72546732/88377f6551e57afa/99d1e4961cf2ef69/e1c95a73c414c41f/e0c264a444a50342.js',
    production:
      'https://kxgcommon.kxll.com/4d471c84a21eb82d/externals/1773997/af07e223d7a66722/1981f894dcc6dc37/9799ca19dffec410/9370fa8a5595b8a6/33f9966f72546732/88377f6551e57afa/99d1e4961cf2ef69/e1c95a73c414c41f/e0c264a444a50342.js',
    // 生效环境
    envs: [isDev, isProd]
  },
  // v4.1.22
  bizcharts: {
    global: 'window BizCharts',
    development:
      'https://kxgcommon.kxll.com/8d5784f4ede8806c/externals/4234427/f027ec581e403723/79d2a2a2c82d10fb/fb6e91fc6ece1011/3144748777ebc337/fb74131010821ad6/e1ef00e7bd0e835c/99bd2b9659263853/3bb095f2fe167031/b9f0ef9e8f3fe063.js',
    production:
      'https://kxgcommon.kxll.com/29dd30c7278c1b37/externals/1690104/8da67552c6dcb3ae/37f14e29889e7e44/4adc27ea06855f38/de311f2552430975/213e1a854799e378/b5ada750efcc7ddc/95b0e8b809540d4d/abb284c01f2799fe/d6a9d2a0c4bc18c1.js',
    // 生效的环境，bizcharts依赖react和react-dom，需要把它们也externals才能externals
    envs: [isProd]
  },
  // v0.16.0
  xlsx: {
    global: 'window XLSX',
    development:
      'https://kxgcommon.kxll.com/ffa05338034b3bc8/externals/732547/7c7eb9be06b8c206/4cf3178032f6cd3d/5234b47d0f05db06/c20b4930f2b96d8a/7f98617fe8051fce/fae1af2f1a345996/8c3776f12eb79d3f/088c1397b830ba4a/4ea6780d17f8c093.js',
    production:
      'https://kxgcommon.kxll.com/45e926c043032db3/externals/411462/d7140980fd68a450/ccac7b3b6a923866/efcce00b821c4785/8ecd82efbb57a146/d8295534e0ab3888/c2b8dfecf5850bc2/c1821cb0b89e3896/bbfcbf7ca5535c6c/f197a0dad2470530.js',
    // 生效环境
    envs: [isDev, isProd]
  },
  // v0.10.1
  '@antv/data-set': {
    global: 'window DataSet',
    development:
      'https://kxgcommon.kxll.com/c7c0d0b2059532cf/externals/1802593/cf9deb99cec4cbb2/a2c1ed17afa3b4f2/abf2be7a65381fd1/05ed8685c71d1da9/2f9c96b08dfc5d61/9a30e09582712163/460e4b4f7312e6a4/426132cde84d0922/447821e57712a54e.js',
    production:
      'https://kxgcommon.kxll.com/f3335fa7c9fa976e/externals/478308/301ed99e0cc39133/46ad950eaacb4cc2/68e576a00736eb4f/e1faad1e574be22f/3193e823bb7c0369/a76c2d6d833e70e5/01bd7c996bd2a5c6/7cb50e151c0a62fd/ee5696f46f868d49.js',
    // 生效环境
    envs: [isDev, isProd]
  },
  // v4.0.8
  wangeditor: {
    global: 'window wangEditor',
    development:
      'https://kxgcommon.kxll.com/2cf6cb9cf4220acb/externals/726176/eda13fc71bcdd136/11d5d66043ed1bbb/1d03ca4ff95f8b47/79b82925c49a5b79/78e647678535cb3d/4491136a10f23896/8d992d1c716df531/749eefd2e38100ca/c3a37c9dc680481b.js',
    production:
      'https://kxgcommon.kxll.com/2ffcdf51397e9083/externals/262438/f74396ee9f206daa/b803a9b5371574e7/a4c771739802f021/a4d74a4b3ece4883/eccb6da4c409e8b0/24d0e746be3c16ad/57ad6a9b09cd39f2/edcfe5e4dc2f1fdf/74412fa33a7fda89.js',
    // 生效环境
    envs: [isDev, isProd]
  },
  // v6.8.0
  'ali-oss': {
    global: 'window OSS',
    development:
      'https://kxgcommon.kxll.com/73c1bd25e378dad8/externals/1183137/d1bdfb756ed7b993/71dd27eedac324e4/2cd171b9585154ef/234c79ac2c22e4d5/9786d6d007247095/aa65fb4fbeca55dc/88280509aecccd5d/441031627384b8cf/2ee800c1e096c281.js',
    production:
      'https://kxgcommon.kxll.com/febaab2221ea7eb7/externals/520935/5d904b51d23697f0/8319de7f96950dff/8a066bc76b5f2b78/d07cf950c63f190d/9cd35ceb5555ebf0/865277432005c4d7/22eeefaf51fb3947/d01b6839df540799/19bdf36bd1b57cdb.js',
    // 生效环境
    envs: [isDev, isProd]
  },
  // v1.0.0-rc.5
  html2canvas: {
    global: 'window html2canvas',
    development:
      'https://kxgcommon.kxll.com/ff3239d41992dfd7/externals/441673/355d181e329e3856/0d582dcfab86bcad/d21d0cc905f426b7/656e6781042613f6/c2fb85021f7a3b62/ad7c9f8c81ff346f/31b0059ac0eab40f/b7f8119df0c0baf1/137c10d4e97f1cab.js',
    production:
      'https://kxgcommon.kxll.com/350a482fd99a3e84/externals/198689/804d07f62ae6cf99/f6e9dc44bfb30a80/e428d4166b965958/f7931cf2cdff4999/b6862c40ee3c4491/71d3537588a3e222/e5eacef2f1d46270/396c5c41a85b9bcc/a9dbbbfdf69c2f14.js',
    // 生效环境
    envs: [isDev, isProd]
  },
  // v4.0.6
  '@ant-design/icons': {
    global: 'window icons',
    development:
      'https://kxgcommon.kxll.com/88ad1b024ed09249/externals/1316213/ee8562eed7814a76/76225a9e0838107b/9815fbb524879f75/80cf383a573f025e/0faa4839551feb2a/263b652fd8199550/754c1efbc744d0ac/10452f480b7587f9/2c12df4079aeb58f.js',
    production:
      'https://kxgcommon.kxll.com/c2a453dafef33f21/externals/831464/e1fe1f35eaaa7d7e/aaab00e81edbe62a/17386d1b2179645c/fb1051f1a746ef0e/f22557847d03dcf2/7b3e0aa4fa029625/97c8816e1758ecdf/7a2a8062bbe38240/a7d74940cc3442b0.js',
    // 生效环境，依赖react，需要把它也externals才能externals
    envs: [isProd]
  },
  // v0.1.4
  'kx-des': {
    global: 'window KxDes',
    development:
      'https://kxgcommon.kxll.com/7cd6b3aa4d11c35f/externals/139975/fdc63b648a9387f2/88f8d99448e2d26e/0240897ef3568c6a/af4dcd4e07fcb06d/494228e2e01f8d4f/1a19e2bd5ad4ea5f/f06aa2b007acf507/d5b5c3165927b355/efe924c6db44b3a1.js',
    production:
      'https://kxgcommon.kxll.com/2d1bd7d93c4a94b2/externals/80357/964b20988eba6f4d/b216f44ebe7307be/b4b5e7607fbe0743/bda21915514f98d8/a66937ab21b46deb/232e55763d08a897/0a9590c1775e9d3f/ddb2d4771ba0ae5d/00a156441725cb45.js',
    // 生效环境
    envs: [isDev, isProd]
  }
}

const filterConfigKeys = Object.keys(configs)
  // 过滤环境
  .filter((key) => configs[key].envs.some(Boolean))
// console.log('filterConfigKeys', filterConfigKeys)

// 根据configs自动生成的externals
const externals = filterConfigKeys.reduce((pre, key) => {
  const value = configs[key]
  pre[key] = value.global
  return pre
}, {})

// external对应的script配置
const headScripts = filterConfigKeys.reduce((pre, key) => {
  const value = configs[key]
  const script = {
    src: value[env],
    charset: 'utf-8'
  }
  pre.push(script)
  return pre
}, [])

// const styles =
//   env === 'development'
//     ? [
//         'https://kxgcommon.kxll.com/a943164706d61d6a/kxgshop/689838/daac5b43cad07ec1/75e3b4808f388dcf/e929163696db0c37/54b085fd58e0614d/8bcc027d858089c7/10197e5793b77718/4220bc4c902f31aa/2e265959ec4f2323/fa07779fe63c0963.css'
//       ]
//     : [
//         'https://kxgcommon.kxll.com/1025f679262f3662/kxgshop/570576/14cbef7ebf47f223/2ddb7adf0771c717/1fba2bb4f06aa2fe/5481a828fdbcb2aa/ee3e47875f6ba80c/022e8b6d136399bf/991ca55f44e4e392/fa26a8a5323e3b75/202564a2e47c6505.css'
//       ]

// console.log('externals', externals)
// console.log('scripts', headScripts)

// export { externals, scripts, styles }
export { externals, headScripts }
