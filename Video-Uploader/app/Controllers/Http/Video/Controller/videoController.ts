import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import videoService from '../Service/videoService'

export default class videoController {
    private service:videoService;
    constructor(){
        this.service=new videoService();
    }
    //get all video
    public async index({response}:HttpContextContract) {
        const getResult=await this.service.getAllVideo();

        return response.status(200).json({
            message:"all the video fetched successfully!",
            data:getResult
        })
    }
    //get single video
    public async show({params,response}:HttpContextContract) {
        const getResult=await this.service.getSingleVideo(params.id);

        return response.status(200).json({
            message:"video fetched successfully!",
            data:getResult
        })
    }
    //upload video
    public async store({ request, response }: HttpContextContract){

        const body=request.all();

        const uploadResult= await this.service.createVideo(body);

        return response.status(200).json({
            message:"Video uploaded successfully",
            data:uploadResult
        })
    }
    //update video
    public async update({params,request,response}:HttpContextContract){
        const body=request.all();
        const updateResult=await this.service.updateVideo(params.id,body);

        return response.status(200).json({
            message:"video info updated successfully!",
            data:updateResult
        })
    }
    public async destroy({params,response}:HttpContextContract){
        const deleteResult=await this.service.deleteVideo(params.id);

        return response.status(200).json({
            message:"video deleted successfully!",
            data:deleteResult
        })
    }
}

