async function fetchYouTubeVideos(query) {
    console.log('Fetching videos for query:', query);
    try {
      if (!process.env.YOUTUBE_API_KEY) {
        console.error('YouTube API key missing, using placeholder data');
        return [
          {
            title: 'Search Results',
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
            thumbnail: '/placeholder.jpg',
          },
        ];
      }
  
      const response = await axios.get(YOUTUBE_SEARCH_URL, {
        params: {
          part: 'snippet',
          q: query,
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 3,
          type: 'video',
          videoEmbeddable: 'true',
          safeSearch: 'moderate',
        },
        timeout: 5000,
      });
  
      console.log('YouTube API response:', response.data); // Add this line
      const videos = response.data.items
        .filter((item) => item.id.videoId)
        .map((item) => ({
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          thumbnail: item.snippet.thumbnails?.medium?.url || `https://img.youtube.com/vi/${item.id.videoId}/mqdefault.jpg`,
        }));
  
      console.log('Processed videos:', videos); // Add this line
      return videos.slice(0, 2);
    } catch (error) {
      console.error(`Error fetching YouTube videos for query "${query}":`, error.message, error.response?.data);
      return [
        {
          title: 'Search Results',
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
          thumbnail: '/placeholder.jpg',
        },
      ];
    }
  }