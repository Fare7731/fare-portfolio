/**
 * Converts various YouTube URL formats into an embed-friendly URL.
 */
export const getEmbedUrl = (url: string): string => {
  let videoId = '';
  
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else {
    // Fallback if already an embed or unknown format
    return url;
  }

  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
};
