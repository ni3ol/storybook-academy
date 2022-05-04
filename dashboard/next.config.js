/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
console.log(`Using API base URL: ${baseUrl}`)

module.exports = nextConfig
