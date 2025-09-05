import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import videoService from '../Service/videoService'

export default class videoController {
    private service:videoService;
    constructor(){
        this.service=new videoService();
    }
    //get all video
    public async index({response}:HttpContextContract) {
        try {
            // Get videos from both Bunny.net and our database
            const [bunnyVideos, databaseVideos] = await Promise.all([
                this.service.getAllVideo(),
                this.service.getAllVideosFromDatabase()
            ]);

            return response.status(200).json({
                message:"All videos fetched successfully!",
                data: {
                    bunnyVideos,
                    databaseVideos,
                    totalInDatabase: databaseVideos.length
                }
            });
        } catch (error) {
            console.error('Error fetching videos:', error);
            return response.status(500).json({
                message: "Error fetching videos",
                error: error.message
            });
        }
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
    //delete video
    public async destroy({params,response}:HttpContextContract){
        const deleteResult=await this.service.deleteVideo(params.id);

        return response.status(200).json({
            message:"video deleted successfully!",
            data:deleteResult
        })
    }

    public async webhook({request,response}:HttpContextContract){
        try {
            console.log('Webhook received:');
            const webhookData = request.all();
            console.log(webhookData);

            // Extract webhook data
            const { VideoLibraryId, VideoGuid, Status } = webhookData;
            
            if (VideoGuid && Status !== undefined) {
                // Update video status in database
                const updatedVideo = await this.service.updateVideoStatus(
                    VideoGuid, 
                    Status, 
                    {
                        metadata: webhookData
                    }
                );
                
                if (updatedVideo) {
                    console.log(`✅ Successfully updated video ${VideoGuid} with status ${Status}`);
                    
                    if (Status === 3) {
                        console.log(`🎉 Video ${VideoGuid} finished processing and is ready!`);
                    }
                } else {
                    console.warn(`⚠️ Video ${VideoGuid} not found in database`);
                }
            } else {
                console.warn('⚠️ Missing VideoGuid or Status in webhook data');
            }

            // Always respond 200 OK to Bunny.net
            return response.status(200).send('OK');
        } catch (error) {
            console.error('❌ Error processing webhook:', error);
            // Still respond 200 OK to prevent Bunny.net from retrying
            return response.status(200).send('OK');
        }
    }
}

