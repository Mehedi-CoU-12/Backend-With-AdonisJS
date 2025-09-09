import Env from "@ioc:Adonis/Core/Env";
import axios from "axios";
import VideoQuery from "./videoQuery";
import { Exception } from "@adonisjs/core/build/standalone";

export default class videoService {
  private apiKey: string;
  private libraryId: string;
  private baseUrl: string;
  private videoQuery: VideoQuery;

  constructor() {
    this.apiKey = Env.get("APP_KEY");
    this.libraryId = Env.get("LIBRARY_ID");
    this.baseUrl = Env.get("BUNNY_URL");
    this.videoQuery = new VideoQuery();
  }

  public async createVideo(body: {
    url: string;
    title?: string;
    collectionId?: string;
  }) {
    const response = await this.uploadVideoInBunny(body);

    const uploadData = {
      videoId: response.id,
      libraryId: this.libraryId,
      title: body.title,
      isFinished: response.success ? "uploading" : "failed",
    };

    const video = await this.videoQuery.createVideo(uploadData);

    if (!video)
      throw new Exception(
        "Failed When Try To Upload Video In MySQL",
        401,
        "E_INVALID_REQUEST"
      );

    return video;
  }

  public async updateVideo(body: any) {
    
    const { id: videoId, ...updateData } = body;

    const response = await this.updateVideoInBunny(videoId, updateData);

    if (response?.data?.success === "false")
      throw new Exception(
        "Failed In Bunny Video Update",
        401,
        "E_INVALID_REQUEST"
      );

    const video = await this.videoQuery.findByVideoId(videoId);

    if (!video)
      throw new Exception("Video Is Not Found!", 401, "E_INVALID_REQUEST");

    return await this.videoQuery.updateVideo(videoId, updateData);
  }

  public async deleteVideo(payload: any) {
    const response = await this.deleteFromBunny(payload.id);

    if (response?.data?.success === "false")
      throw new Exception(
        "Failed In Bunny Video Deletion",
        401,
        "E_INVALID_REQUEST"
      );

    const existingVideo = await this.videoQuery.findByVideoId(payload.id);

    if (!existingVideo)
      throw new Exception("Video Not Found!", 404, "E_VIDEO_NOT_FOUND");

    // Also delete video from our MySQL database
    const deletedVideo = await this.videoQuery.deleteByVideo(payload.id);

    return {
      ...response,
      deletedVideo,
    };
  }

  public async getSingleVideo({ id }: any) {
    const video = await this.videoQuery.findByVideoId(id);

    if (!video)
      throw new Exception("Video Not Found!", 404, "E_VIDEO_NOT_FOUND");

    return video;
  }

  public async getAllVideosFromMyDatabase() {
    return await this.videoQuery.getAllVideos();
  }

  public async getAllVideoFromBunnyDatabase() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/library/${this.libraryId}/videos`,
        {
          headers: {
            AccessKey: this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      return response?.data;
    } catch (error) {
      throw new Exception(error);
    }
  }

  public async getAllVideo() {
    return await Promise.all([
      this.getAllVideoFromBunnyDatabase(),
      this.getAllVideosFromMyDatabase(),
    ]);
  }

  // Webhook handling methods
  public async updateVideoStatus(payload: any = {}) {
    const { Status: status, VideoGuid: videoGuid } = payload;

    if (status < 3 || status > 5) return;

    if (status == 3 || status == 4) payload.isFinished = "success";
    else payload.isFinished = "failed";

    payload.processingStatus = status;

    const updateData = {
      isFinished: payload.isFinished,
      processingStatus: payload.processingStatus,
    };

    //create video playable link
    const videoPlayLinkUrl = `https://iframe.mediadelivery.net/play/${this.libraryId}/${videoGuid}`;
    payload.playLink = videoPlayLinkUrl;

    const video = await this.videoQuery.findByVideoId(videoGuid);

    if (!video)
      throw new Exception("Video Not Found!", 404, "E_VIDEO_NOT_FOUND");

    return await this.videoQuery.updateVideo(payload.VideoGuid, updateData);
  }

  //Bunny Service
  public async deleteFromBunny(id: string) {
    try {
      // Delete video from Bunny.net
      const response = await axios.delete(
        `${this.baseUrl}/library/${this.libraryId}/videos/${id}`,
        {
          headers: {
            AccessKey: this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      return response?.data;
    } catch (error) {
      throw new Exception("Bunny Deleted Failed!", 400, "E_INVALID_REQUEST");
    }
  }
  //create  video in bunny-cdn
  public async createVideoInBunny(title?: string) {
    try {
      const body = { title };
      const response = await axios.post(
        `${this.baseUrl}/library/${this.libraryId}/videos`,
        body,
        {
          headers: {
            AccessKey: this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      return response?.data;
    } catch (error) {
      throw new Exception(
        `Failed When Video Is Creating In Bunny!:${error}`,
        401,
        "E_INVALID_REQUEST"
      );
    }
  }

  //upload video in bunny-cdn
  public async uploadVideoInBunny(body: {
    url: string;
    title?: string;
    collectionId?: string;
  }) {
    try {
      const createVideoResponse = await this.createVideoInBunny(body.title);

      const { guid: videoId } = createVideoResponse;

      const response = await axios.post(
        `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}/fetch`,
        { url: body.url },
        {
          headers: {
            AccessKey: this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      response.data.id = videoId;

      return response.data;
    } catch (error) {
      throw new Exception(
        `Failed When Video Is Uploading In Bunny!:${error}`,
        401,
        "E_INVALID_REQUEST"
      );
    }
  }
  //update video in bunny-cnd
  public async updateVideoInBunny(videoId: string, body: { title?: string }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`,
        body,
        {
          headers: {
            AccessKey: this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      return response?.data;
    } catch (error) {
      throw new Exception(
        `Failed When Try To Update Video In Bunny:${error}`,
        401,
        "E_INVALID_REQUEST"
      );
    }
  }
}
