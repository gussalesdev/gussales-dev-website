import { promises as fs } from 'fs';
import path from 'path';

const YOUTUBE_BASE_URL = 'https://youtube.googleapis.com/youtube/v3';
const CHANNEL_ID = 'UCQmw7Ty7UN8i7_dan_uKNfQ';

export type TopVideo = {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: string;
};

const YoutubeApi = {
  getTopVideos: async (limit: number) => {
    if (process.env.ENVIRONMENT === 'development') {
      const data = await fs.readFile(
        path.resolve('__generated__/getTopVideos.json'),
        { encoding: 'utf-8' }
      );

      return JSON.parse(data);
    }

    try {
      const topVideosResponse = await fetch(
        `${YOUTUBE_BASE_URL}/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${limit}&order=viewCount&key=${process.env.YOUTUBE_API_KEY}`
      );
      const { items: topVideos } = await topVideosResponse.json();
      const videosIds = topVideos.map((topVideo) => topVideo.id.videoId);

      const topVideosStatisticsResponse = await fetch(
        `${YOUTUBE_BASE_URL}/videos?part=statistics&id=${videosIds.join(
          '&id='
        )}&key=${process.env.YOUTUBE_API_KEY}`
      );
      const { items: topVideosStatistics } =
        await topVideosStatisticsResponse.json();
      const mappedTopVideos = topVideos.map(({ id, snippet }) => ({
        id: id.videoId,
        title: snippet.title,
        publishedAt: snippet.publishedAt,
        viewCount: topVideosStatistics.find((x) => x.id === id.videoId)
          .statistics.viewCount,
      })) as TopVideo[];

      fs.writeFile(
        path.resolve('__generated__/getTopVideos.json'),
        JSON.stringify(mappedTopVideos)
      );

      return mappedTopVideos;
    } catch (e) {
      console.log(e.message);

      const data = await fs.readFile(
        path.resolve('__generated__/getTopVideos.json'),
        { encoding: 'utf-8' }
      );
      return JSON.parse(data);
    }
  },
};

export default YoutubeApi;