import { Exception } from "@adonisjs/core/build/standalone";
import Video from "App/Models/Video";

export default class VideoQuery {
  public async createVideo(data: {
    videoId: string;
    libraryId: string;
    title?: string;
    isFinished?: string;
    processingStatus?: number;
  }): Promise<Video> {
    
      const video = await Video.create({
        videoId: data.videoId,
        libraryId: data.libraryId,
        title: data.title || "Untitled Video",
        isFinished: data.isFinished || "uploading",
        processingStatus: data.processingStatus || 0,
      });

      return video;
  }

  public async findByVideoId(videoId: string): Promise<Video | null> {
    return await Video.query().select('video_id',videoId).where("videoId", videoId).first();
  }

  public async findById(id: number): Promise<Video | null> {
    return await Video.query().select('id').where('id',id).first();
  }

  public async getAllVideos(): Promise<Video[]> {
    let query = Video.query();
    return await query;
  }

  public async updateByVideoId(
    videoId: string,
    updateData: {
      title?: string;
      isFinished?: string;
      processingStatus?: number;
      metadata?: any;
    }
  ): Promise<Video | null> {
    
      const video = await this.findByVideoId(videoId);

      if (!video) {
        console.warn(`⚠️ Video with videoId ${videoId} not found for update`);
        return null;
      }

      // Update fields if provided
      if (updateData.title !== undefined) video.title = updateData.title;
      if (updateData.isFinished !== undefined)
        video.isFinished = updateData.isFinished;
      if (updateData.processingStatus !== undefined)
        video.processingStatus = updateData.processingStatus;
      if (updateData.metadata !== undefined) {
        video.metadata = { ...video.metadata, ...updateData.metadata };
      }

      return await video.save();
  }

  public async updateVideoStatus(
    videoGuid: string,
    status: number,
    additionalData: any = {}
  ): Promise<Video | null> {
    const video = await this.findByVideoId(videoGuid);

    if (!video) {
      console.warn(`⚠️ Video with GUID ${videoGuid} not found in database`);
      return null;
    }

    video.processingStatus = status;
    video.isFinished = additionalData.status;
    video.playLink = additionalData.playLink;

    // Save changes
    return await video.save();
  }

  public async deleteByVideoId(videoId: string): Promise<Video | null> {
    const video = await this.findByVideoId(videoId);

    if (!video) {
      throw new Exception(
        `Video with videoId ${videoId} not found`,
        404,
        "E_NOT_FOUND"
      );
    }

    const deletedVideo = { ...video.toJSON() } as Video; // Keep copy before deletion
    await video.delete();

    return deletedVideo;
  }
}
