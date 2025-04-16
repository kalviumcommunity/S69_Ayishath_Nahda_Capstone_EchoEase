// utils/checkVideo.js
export async function checkVideoAvailability(url) {
    if (!url.includes('youtube.com')) return false;
    
    try {
      const videoId = url.split('v=')[1]?.split('&')[0];
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      return response.ok;
    } catch {
      return false;
    }
  }