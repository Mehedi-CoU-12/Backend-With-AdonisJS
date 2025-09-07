import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import videoService from "../Service/videoService";

export default class videoController {
  private service: videoService;
  constructor() {
    this.service = new videoService();
  }
  //get all video
  public async index({ response }: HttpContextContract) {
    try {
      // Get videos from both Bunny.net and our database
      const [bunnyVideos, databaseVideos] = await Promise.all([
        this.service.getAllVideoFromBunnyDatabase(),
        this.service.getAllVideosFromMyDatabase(),
      ]);

      return response.status(200).json({
        message: "All videos fetched successfully!",
        data: {
          bunnyVideos,
          databaseVideos,
          totalInDatabase: databaseVideos.length,
        },
      });
    } catch (error) {
      console.error("Error fetching videos:", error);
      return response.status(500).json({
        message: "Error fetching videos",
        error: error.message,
      });
    }
  }
  //get single video
  public async show({ params, response }: HttpContextContract) {
    try {
      const getResult = await this.service.getSingleVideo(params.id);

      return response.status(200).json({
        message: "video fetched successfully!",
        data: getResult,
      });
    } catch (error) {
      console.error("Error fetching video:", error);
      return response.status(500).json({
        message: "Error fetching video",
        error: error.message,
      });
    }
  }
  //upload video
  public async store({ request, response }: HttpContextContract) {
    try {
      const body = request.all();

      const uploadResult = await this.service.createVideo(body);

      return response.status(200).json({
        message: "Video uploaded successfully",
        data: uploadResult,
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      return response.status(500).json({
        message: "Error uploading video",
        error: error.message,
      });
    }
  }
  //update video
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const body = request.all();
      const updateResult = await this.service.updateVideo(params.id, body);

      return response.status(200).json({
        message: "video info updated successfully!",
        data: updateResult,
      });
    } catch (error) {
      console.error("Error updating video:", error);
      return response.status(500).json({
        message: "Error updating video",
        error: error.message,
      });
    }
  }
  //delete video
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const deleteResult = await this.service.deleteVideo(params.id);

      return response.status(200).json({
        message: "video deleted successfully!",
        data: deleteResult,
      });
    } catch (error) {
      console.error("Error deleting video:", error);
      return response.status(500).json({
        message: "Error deleting video",
        error: error.message,
      });
    }
  }

  public async webhook({ request, response }: HttpContextContract) {
    try {
      console.log("Webhook received:");
      console.log(request.all());

      // Extract webhook data
      const { VideoGuid, Status } = request.all();

      if (Status === 3 || Status === 5) {
        console.log(`Video ${VideoGuid} finished processing!`);

        // Update the video status in database
        await this.service.updateVideoStatus(VideoGuid, Status, {
          metadata: request.all(),
        });
      }

      // Respond 200 OK to Bunny.net
      return response.status(200).send("OK");
    } catch (error) {
      console.error("❌ Error processing webhook:", error);
      // Still respond 200 OK to prevent Bunny.net from retrying
      return response.status(200).send("OK");
    }
  }
}
