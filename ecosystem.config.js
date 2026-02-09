module.exports = {
  apps: [
    {
      name: "psp-doc",
      cwd: "/var/www/psp-doc.fineopay.com",
      script: "node",
      args: "node_modules/next/dist/bin/next start -p 3010 -H 127.0.0.1",
      env: {
        NODE_ENV: "production"
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G"
    }
  ]
}
