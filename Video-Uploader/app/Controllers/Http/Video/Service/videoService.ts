import Env from "@ioc:Adonis/Core/Env";
import axios from "axios";
import Video from "App/Models/Video";

export default class videoService {
  private apiKey: string;
  private libraryId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = Env.get("APP_KEY");
    this.libraryId = Env.get("LIBRARY_ID");
    this.baseUrl = Env.get("BUNNY_URL");
  }

  public async createVideo(body: any) {

      // Upload video to Bunny.net
      const response = await axios.post(
        `${this.baseUrl}/library/${this.libraryId}/videos/fetch`,
        body,
        {
          headers: {
            AccessKey: this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      const bunnyResponse = response?.data;

      // Save video info to database
      if (bunnyResponse && bunnyResponse.guid) {
        const video = await Video.create({
          videoId: bunnyResponse.guid,
          libraryId: this.libraryId,
          videoGuid: bunnyResponse.guid,
          title: body.title || 'Untitled Video',
          description: body.description || null,
          originalFilename: body.originalFilename || null,
          isFinished: false,
          processingStatus: 0, // 0 = queued/uploading
          metadata: bunnyResponse
        });

        return {
          ...bunnyResponse,
          databaseId: video.id,
          savedToDatabase: true
        };
      }

      return bunnyResponse;
    } 

  public async updateVideo(id: string, body: Object) {
    const response = await axios.post(
      `${this.baseUrl}/library/${this.libraryId}/videos/${id}`,
      body,
      {
        headers: {
          AccessKey: this.apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  }

  public async deleteVideo(id: string) {
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
  }

  public async getSingleVideo(id: string) {
    const response = await axios.get(
      `${this.baseUrl}/library/${this.libraryId}/videos/${id}`,
      {
        headers: {
          AccessKey: this.apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  }
  public async getAllVideo() {
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
  }

  // Webhook handling methods
  public async updateVideoStatus(videoGuid: string, status: number, additionalData: any = {}) {
    try {
      const video = await Video.findBy('videoGuid', videoGuid);
      
      if (video) {
        video.processingStatus = status;
        video.isFinished = status === 3; // Status 3 means finished processing
        
        // Update additional fields if provided
        if (additionalData.duration) video.duration = additionalData.duration;
        if (additionalData.thumbnailUrl) video.thumbnailUrl = additionalData.thumbnailUrl;
        if (additionalData.videoUrl) video.videoUrl = additionalData.videoUrl;
        if (additionalData.fileSize) video.fileSize = additionalData.fileSize;
        
        // Update metadata
        if (additionalData.metadata) {
          video.metadata = { ...video.metadata, ...additionalData.metadata };
        }
        
        await video.save();
        
        console.log(`Updated video ${videoGuid} status to ${status}`);
        return video;
      } else {
        console.warn(`Video with GUID ${videoGuid} not found in database`);
        return null;
      }
    } catch (error) {
      console.error('Error updating video status:', error);
      throw error;
    }
  }

  public async getVideoByGuid(videoGuid: string) {
    try {
      return await Video.findBy('videoGuid', videoGuid);
    } catch (error) {
      console.error('Error getting video by GUID:', error);
      throw error;
    }
  }

  public async getAllVideosFromDatabase() {
    try {
      return await Video.all();
    } catch (error) {
      console.error('Error getting all videos from database:', error);
      throw error;
    }
  }
}
