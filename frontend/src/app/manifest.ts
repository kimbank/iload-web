import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'iLoad',
    short_name: 'iLoad',
    description: 'iLoad',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '96x96',
        type: 'image/x-icon',
      },
    ],
  }
}