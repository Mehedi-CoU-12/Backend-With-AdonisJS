import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import videoService from "./videoService";
import VideoValidator from "./videoValidator";

export default class videoController {
  private service: videoService;
  private validator: VideoValidator;
  constructor() {
    this.service = new videoService();
    this.validator = new VideoValidator();
  }
  //get all video
  public async index() {
    return await this.service.getAllVideo();
  }
  //get single video
  public async show(ctx: HttpContextContract) {
    const payload = await this.validator.videoIdValidator(ctx);

    const getResult = await this.service.getSingleVideo(payload);

    return ctx.response.status(200).json({ success: getResult });
  }
  //upload video
  public async store(ctx: HttpContextContract) {
    // Validate request body
    const payload = await this.validator.createVideoValidator(ctx);

    const uploadResult = await this.service.createVideo(payload);

    return ctx.response.status(201).json(uploadResult);
  }
  //update video
  public async update(ctx: HttpContextContract) {
    const payload = await this.validator.updateVideoValidator(ctx);

    const updateResult = await this.service.updateVideo(payload);

    return ctx.response.status(200).json({ success: updateResult });
  }
  //delete video
  public async destroy(ctx: HttpContextContract) {
    const payload = await this.validator.videoIdValidator(ctx);

    const deleteResult = await this.service.deleteVideo(payload);

    return ctx.response.status(200).json(deleteResult);
  }

  //webhook for checking the status of the video
  public async webhook(ctx: HttpContextContract) {
    console.log(ctx.request.all());

    const payload = await this.validator.webhookValidator(ctx);

    await this.service.updateVideoStatus(payload);

    return ctx.response.status(200).send("OK");
  }
}
