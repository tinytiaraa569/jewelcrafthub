export const backendurl = 'http://localhost:8000/api'


const isProduction = process.env.NODE_ENV === "production";

export const imgurl = isProduction 
  ? 'https://backendjewelcraft.vercel.app'  // Production image base URL
  : 'http://localhost:8000';  