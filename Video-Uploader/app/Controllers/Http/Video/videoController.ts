import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import videoService from "./videoService";
import {
  CreateVideoValidator,
  UpdateVideoValidator,
  VideoIdValidator,
  WebhookValidator,
} from "./videoValidator";

export default class videoController {
  private service: videoService;
  constructor() {
    this.service = new videoService();
  }
  //get all video
  public async index({ response }: HttpContextContract) {
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

    return response.status(200).json(responseData);
  }
  //get single video
  public async show({ params, request, response }: HttpContextContract) {
    
    request.all().id=params.id;
    const payload = await request.validate(VideoIdValidator)

    const getResult = await this.service.getSingleVideo(payload);

    return response.status(200).json(getResult);
  }
  //upload video
  public async store({ request, response }: HttpContextContract) {
    // Validate request body
    const validatedData = await request.validate(CreateVideoValidator);

    const uploadResult = await this.service.createVideo(validatedData);

    return response.status(201).json(uploadResult);
  }
  //update video
  public async update({ params, request, response }: HttpContextContract) {

      request.all().id=params.id;
      const validatedData = await request.validate(UpdateVideoValidator);

      const updateResult = await this.service.updateVideo(validatedData);

      return response.status(200).json( updateResult);
  }
  //delete video
  public async destroy({ params, request, response }: HttpContextContract) {
      request.all().id=params.id;
      const payload=await request.validate(VideoIdValidator);

      const deleteResult = await this.service.deleteVideo(payload);

      return response.status(200).json(deleteResult);
  }

  public async webhook({ request, response }: HttpContextContract) {
      console.log("Webhook received:");
      console.log(request.all());

      const validatedData = await request.validate(WebhookValidator);

        // Update the video status in database
        await this.service.updateVideoStatus(validatedData);

      // Respond 200 OK to Bunny.net
      return response.status(200).send("OK");
  }
}
