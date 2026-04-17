import { mergeConfig } from 'vite'

export default (config) => {
  return mergeConfig(config, {
    server: {
      allowedHosts: [
        'admin.iaamonline.org',
        'iaamonline.org',
        'localhost',
        '127.0.0.1'
      ],
    },
  })
}
