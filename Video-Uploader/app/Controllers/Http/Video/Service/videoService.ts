import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios';

export default class videoService{
    private apiKey:string;
    private libraryId:string;
    private baseUrl:string;

    constructor(){
        this.apiKey = Env.get('APP_KEY');
        this.libraryId = Env.get('LIBRARY_ID');
        this.baseUrl = Env.get('BUNNY_URL');
    }

    public async createVideo(body:any){
        const response= await axios.post(`${this.baseUrl}/library/${this.libraryId}/videos/fetch`,body,{
            headers:{
                AccessKey:this.apiKey,
                'Content-Type':'application/json'
            }
        })

        return response?.data;
    }
    public async updateVideo(){}
    public async deleteVideo(){}
    public async getVideo(){}
    public async getAllVideo(){}
}