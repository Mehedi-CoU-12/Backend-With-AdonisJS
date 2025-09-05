import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import videoService from '../Service/videoService'

export default class videoController {
    private service:videoService;
    constructor(){
        this.service=new videoService();
    }

    public async index() {
        console.log('-----------------------------------------')
        return {mehedi:"hasan"};
    }
    public async show() {}
    public async store({ request, response }: HttpContextContract){

        const body=request.all();

        const uploadResult= await this.service.createVideo(body);

        return response.status(200).json({
            message:"Video uploaded successfully",
            data:uploadResult
        })
    }
    public async update(){}
    public async destroy(){}
}

