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
    try {
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
      if (bunnyResponse) {
        const video = await Video.create({
          videoId: bunnyResponse?.id,
          libraryId: this.libraryId,
          title: body.title || "Untitled Video",
          isFinished: "uploading",
          processingStatus: 0, // 0 = queued/uploading
          metadata: bunnyResponse,
        });

        return {
          ...bunnyResponse,
          databaseId: video.id,
          savedToDatabase: true,
        };
      }

      return bunnyResponse;
    } catch (error) {
      console.error("Error creating video:", error);
      throw error;
    }
  }

  public async updateVideo(id: string, body: any) {
    try {
      // Update video in Bunny.net
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

      const bunnyResponse = response?.data;

      // Also update video in our MySQL database
      const video = await Video.findBy("videoId", id);
      if (video) {
        // Update fields that might have changed
        if (body.title) video.title = body.title;

        // Update metadata with the response from Bunny.net
        video.metadata = { ...video.metadata, ...bunnyResponse };

        await video.save();

        console.log(
          `✅ Updated video ${id} in both Bunny.net and MySQL database`
        );

        return {
          ...bunnyResponse,
          databaseUpdated: true,
          databaseId: video.id,
        };
      } else {
        console.warn(
          `⚠️ Video ${id} updated in Bunny.net but not found in local database`
        );
        return {
          ...bunnyResponse,
          databaseUpdated: false,
          warning: "Video not found in local database",
        };
      }
    } catch (error) {
      console.error("Error updating video:", error);
      throw error;
    }
  }

  public async deleteVideo(id: string) {
    try {
      // First check if video exists in our database
      const video = await Video.findBy("videoId", id);

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

      const bunnyResponse = response?.data;

      // Also delete video from our MySQL database
      if (video) {
        await video.delete();
        console.log(
          `✅ Deleted video ${id} from both Bunny.net and MySQL database`
        );

        return {
          ...bunnyResponse,
          databaseDeleted: true,
          deletedDatabaseId: video.id,
          deletedTitle: video.title,
        };
      } else {
        console.warn(
          `⚠️ Video ${id} deleted from Bunny.net but was not found in local database`
        );
        return {
          ...bunnyResponse,
          databaseDeleted: false,
          warning: "Video was not found in local database",
        };
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
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
      console.error("Error getting all videos from database:", error);
      throw error;
    }
  }

  // Webhook handling methods
  public async updateVideoStatus(
    videoGuid: string,
    status: number,
    additionalData: any = {}
  ) {
    try {
      // Try to find by videoId first (which stores the Bunny.net video ID/GUID)
      const video = await Video.findBy("videoId", videoGuid);

      if (video) {
        video.processingStatus = status;
        video.isFinished = status === 3 ? "success" : "failed"; // Status 3 means finished processing

        // Update metadata
        if (additionalData.metadata) {
          video.metadata = { ...video.metadata, ...additionalData.metadata };
        }

        await video.save();

        console.log(
          `Updated video ${videoGuid} status to ${status} - isFinished: ${video.isFinished}`
        );
        return video;
      } else {
        console.warn(`Video with GUID ${videoGuid} not found in database`);
        return null;
      }
    } catch (error) {
      console.error("Error updating video status:", error);
      throw error;
    }
  }

  public async getVideoByGuid(videoGuid: string) {
    try {
      return await Video.findBy("videoId", videoGuid);
    } catch (error) {
      console.error("Error getting video by GUID:", error);
      throw error;
    }
  }

  public async getAllVideosFromMyDatabase() {
    try {
      return await Video.all();
    } catch (error) {
      console.error("Error getting all videos from database:", error);
      throw error;
    }
  }
}
