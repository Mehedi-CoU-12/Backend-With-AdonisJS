import Env from "@ioc:Adonis/Core/Env";
import axios from "axios";

export default class videoService {
  private apiKey: string;
  private libraryId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = Env.get("APP_KEY");
    this.libraryId = Env.get("LIBRARY_ID");
    this.baseUrl = Env.get("BUNNY_URL");
  }

  public async createVideo(body: any) {
    const response = await axios.post(
      `${this.baseUrl}/library/${this.libraryId}/videos/fetch`,
      body,
      {
        headers: {
          AccessKey: this.apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  }

  public async updateVideo(id: string, body: Object) {
    const response = await axios.post(
      `${this.baseUrl}/library/${this.libraryId}/videos/${id}`,
      body,
      {
        headers: {
          AccessKey: this.apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  }

  public async deleteVideo(id: string) {
    const response = await axios.delete(
      `${this.baseUrl}/library/${this.libraryId}/videos/${id}`,
      {
        headers: {
          AccessKey: this.apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  }

  public async getSingleVideo(id: string) {
    const response = await axios.get(
      `${this.baseUrl}/library/${this.libraryId}/videos/${id}`,
      {
        headers: {
          AccessKey: this.apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  }
  public async getAllVideo() {
    const response = await axios.get(
      `${this.baseUrl}/library/${this.libraryId}/videos`,
      {
        headers: {
          AccessKey: this.apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  }
}
