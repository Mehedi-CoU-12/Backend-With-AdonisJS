import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import videoService from "../Service/videoService";
import { 
  CreateVideoValidator, 
  UpdateVideoValidator, 
  VideoIdValidator, 
  WebhookValidator 
} from "../Validator/videoValidator";

export default class videoController {
  private service: videoService;
  constructor() {
    this.service = new videoService();
  }
  //get all video
  public async index({ request, response }: HttpContextContract) {
    try {
    
      // Get videos from both Bunny.net and our database
      const promises = [
        this.service.getAllVideoFromBunnyDatabase(),
        this.service.getAllVideosFromMyDatabase(),
      ];

      
      const results = await Promise.all(promises);
      const [bunnyVideos, databaseVideos, stats] = results;

      let responseData: any = {
        bunnyVideos,
        databaseVideos,
        totalInDatabase: databaseVideos.length,
      };
      
      // Add statistics if requested
      if (stats) {
        responseData.statistics = stats;
      }

      return response.status(200).json({
        message: "All videos fetched successfully!",
        data: responseData,
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
  public async show({ params, request, response }: HttpContextContract) {
    try {
      // Validate video ID parameter
      await request.validate({
        schema: VideoIdValidator,
        data: { id: params.id }
      });

      const getResult = await this.service.getSingleVideo(params.id);

      return response.status(200).json({
        message: "video fetched successfully!",
        data: getResult,
      });
    } catch (error) {
      console.error("Error fetching video:", error);
      
      // Handle validation errors
      if (error.messages) {
        return response.status(422).json({
          message: "Validation failed",
          errors: error.messages,
        });
      }

      return response.status(500).json({
        message: "Error fetching video",
        error: error.message,
      });
    }
  }
  //upload video
  public async store({ request, response }: HttpContextContract) {
    try {
      // Validate request body
      const validatedData = await request.validate({
        schema: CreateVideoValidator,
      });

      const uploadResult = await this.service.createVideo(validatedData);

      return response.status(201).json({
        message: "Video uploaded successfully",
        data: uploadResult,
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      
      // Handle validation errors
      if (error.messages) {
        return response.status(422).json({
          message: "Validation failed",
          errors: error.messages,
        });
      }

      return response.status(500).json({
        message: "Error uploading video",
        error: error.message,
      });
    }
  }
  //update video
  public async update({ params, request, response }: HttpContextContract) {
    try {
      // Validate video ID parameter
      await request.validate({
        schema: VideoIdValidator,
        data: { id: params.id }
      });

      // Validate request body
      const validatedData = await request.validate({
        schema: UpdateVideoValidator,
      });

      const updateResult = await this.service.updateVideo(params.id, validatedData);

      return response.status(200).json({
        message: "video info updated successfully!",
        data: updateResult,
      });
    } catch (error) {
      console.error("Error updating video:", error);
      
      // Handle validation errors
      if (error.messages) {
        return response.status(422).json({
          message: "Validation failed",
          errors: error.messages,
        });
      }

      return response.status(500).json({
        message: "Error updating video",
        error: error.message,
      });
    }
  }
  //delete video
  public async destroy({ params, request, response }: HttpContextContract) {
    try {
      // Validate video ID parameter
      await request.validate({
        schema: VideoIdValidator,
        data: { id: params.id }
      });

      const deleteResult = await this.service.deleteVideo(params.id);

      return response.status(200).json({
        message: "video deleted successfully!",
        data: deleteResult,
      });
    } catch (error) {
      console.error("Error deleting video:", error);
      
      // Handle validation errors
      if (error.messages) {
        return response.status(422).json({
          message: "Validation failed",
          errors: error.messages,
        });
      }

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

        // Validate webhook data
        const validatedData = await request.validate({
            schema: WebhookValidator,
        });

        const { VideoGuid, Status } = validatedData;

        if (Status === 3 || Status === 5) {
            console.log(`Video ${VideoGuid} finished processing!`);

            // Update the video status in database
            await this.service.updateVideoStatus(VideoGuid, Status, {
            metadata: validatedData,
            });
        }

        // Respond 200 OK to Bunny.net
        return response.status(200).send("OK");
    } catch (error) {
        console.error("❌ Error processing webhook:", error);
        
        // Handle validation errors for webhooks
        if (error.messages) {
            console.error("Webhook validation failed:", error.messages);
            // Still respond 200 OK to prevent Bunny.net from retrying invalid webhooks
            return response.status(200).send("OK");
        }
        
        // Still respond 200 OK to prevent Bunny.net from retrying
        return response.status(200).send("OK");
    }
  }
}
