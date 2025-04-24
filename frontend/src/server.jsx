export const backendurl = 'https://backendjewelcraft.vercel.app/api'


const isProduction = process.env.NODE_ENV === "production";

export const imgurl = isProduction 
  ? 'https://backendjewelcraft.vercel.app'  // Production image base URL
  : 'https://backendjewelcraft.vercel.app';  