module.exports = {
  apps: [
    {
      name: 'azari-client',
      script: 'react-router-serve',
      args: './build/server/index.js',
      cwd: '/var/www/azari',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        API_URL: 'http://localhost:4000',
      },
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
