/*
module.exports = {
  apps:[
    {
      port: 8899,
      name: 'oiomm',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}*/

// /wwwroot/zooow/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'zooow',
    script: './.output/server/index.mjs',
    cwd: '/wwwroot/zooow',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '200M',

    // 日志配置
    error_file: '/wwwroot/zooow/logs/error.log',
    out_file: '/wwwroot/zooow/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',

    // 环境变量
    env: {
      NODE_ENV: 'production',
      HOST: '0.0.0.0',
      PORT: 8899,
      NUXT_PUBLIC_BASE_URL: '/'
    },

    // 进程管理
    autorestart: true,
    restart_delay: 3000,
    watch: false,
    ignore_watch: [
      'node_modules',
      '.git',
      'logs',
      '.output/public'
    ]
  }]
}