import Video from "App/Models/Video";

export default class VideoQuery {
  public async createVideo(body: {
    videoId: string;
    libraryId: string;
    title?: string;
    isFinished?: string;
    processingStatus?: number;
  }): Promise<Video> {
    return await Video.create({
      videoId: body.videoId,
      libraryId: body.libraryId,
      title: body.title || "Untitled Video",
      isFinished: body.isFinished || "uploading",
      processingStatus: body.processingStatus || 0,
    });
  }

  public async findByVideoId(videoId: string): Promise<Video | null> {
    return await Video.query()
      .select("video_id")
      .where("video_id", videoId)
      .first();
  }

  public async findById(id: number): Promise<Video | null> {
    return await Video.query().where("id", id).first();
  }

  public async getAllVideos(): Promise<Video[]> {
    return await Video.all();
  }

  public async updateVideo(videoId:string,updateData: {
    title?: string;
    isFinished?: string;
    processingStatus?: number;
  }) {
    return await Video.query()
      .where("video_id", videoId)
      .update(updateData);
  }

  public async deleteByVideo(videoId: string): Promise<Boolean> {
    await Video.query().where("video_id", videoId).delete();
    return true;
  }
}
