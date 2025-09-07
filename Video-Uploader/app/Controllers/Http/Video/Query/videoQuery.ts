// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


// export default class VideosController {
//   private bunnyStreamService: BunnyStreamService

//   constructor() {
//     this.bunnyStreamService = new BunnyStreamService()
//   }

//   public async uploadFromUrl({ request, response }: HttpContextContract) {
//     try {
//       // Get request data
//       const { videoUrl, title, collectionId } = request.all()

//       // Create video in Bunny Stream
//       const video = await this.bunnyStreamService.createVideo(title, collectionId)

//       // Upload video from URL
//       const uploadResult = await this.bunnyStreamService.uploadVideoFromUrl(video.guid, videoUrl)

//       return response.ok({
//         message: 'Video upload initiated successfully',
//         data: {
//           videoId: video.guid,
//           title: video.title,
//           uploadTask: uploadResult.task,
//           // video,
//         },
//       })
//     } catch (error) {
//       return response.internalServerError({
//         message: 'Failed to upload video',
//         error: error.message,
//       })
//     }
//   }

//   public async show({ params, response }: HttpContextContract) {
//     try {
//       const videoId = params.id

//       if (!videoId) {
//         return response.badRequest({
//           message: 'Video ID is required',
//         })
//       }

//       const video = await this.bunnyStreamService.getVideo(videoId)

//       return response.ok({
//         message: 'Video retrieved successfully',
//         data: video,
//       })
//     } catch (error) {
//       return response.internalServerError({
//         message: 'Failed to retrieve video',
//         error: error.message,
//       })
//     }
//   }

//   public async index({ request, response }: HttpContextContract) {
//     try {
//       const {
//         page = 1,
//         itemsPerPage = 10,
//         search,
//         collection,
//         orderBy,
//       } = request.only(['page', 'itemsPerPage', 'search', 'collection', 'orderBy'])

//       const videos = await this.bunnyStreamService.listVideos(
//         Number(page),
//         Number(itemsPerPage),
//         search,
//         collection,
//         orderBy
//       )

//       return response.ok({
//         message: 'Videos retrieved successfully',
//         data: videos,
//       })
//     } catch (error) {
//       return response.internalServerError({
//         message: 'Failed to retrieve videos',
//         error: error.message,
//       })
//     }
//   }

//   public async update({ params, request, response }: HttpContextContract) {
//     try {
//       const videoId = params.id
//       // Get request data
//       const updates = request.all()

//       if (!videoId) {
//         return response.badRequest({
//           message: 'Video ID is required',
//         })
//       }

//       const video = await this.bunnyStreamService.updateVideo(videoId, updates)

//       return response.ok({
//         message: 'Video updated successfully',
//         data: video,
//       })
//     } catch (error) {
//       return response.internalServerError({
//         message: 'Failed to update video',
//         error: error.message,
//       })
//     }
//   }

//   public async destroy({ params, response }: HttpContextContract) {
//     try {
//       const videoId = params.id

//       if (!videoId) {
//         return response.badRequest({
//           message: 'Video ID is required',
//         })
//       }

//       await this.bunnyStreamService.deleteVideo(videoId)

//       return response.ok({
//         message: 'Video deleted successfully',
//       })
//     } catch (error) {
//       return response.internalServerError({
//         message: 'Failed to delete video',
//         error: error.message,
//       })
//     }
//   }
// }


// import axios, { AxiosResponse } from 'axios'
// import Env from '@ioc:Adonis/Core/Env'

// export interface BunnyVideoUploadResponse {
//   videoLibraryId: string
//   guid: string
//   title: string
//   dateUploaded: string
//   views: number
//   isPublic: boolean
//   length: number
//   status: number
//   framerate: number
//   rotation: number
//   width: number
//   height: number
//   availableResolutions: string
//   thumbnailCount: number
//   encodeProgress: number
//   storageSize: number
//   captions: any[]
//   hasMP4Fallback: boolean
//   collectionId: string
//   thumbnailFileName: string
//   averageWatchTime: number
//   totalWatchTime: number
//   category: string
//   chapters: any[]
//   moments: any[]
//   metaTags: any[]
// }

// export interface BunnyUploadUrlResponse {
//   message: string
//   task: string
// }

// export  class BunnyStreamService {
//   private apiKey: string
//   private libraryId: string
//   private baseUrl: string

//   constructor() {
//     this.apiKey = Env.get('BUNNY_STREAM_API_KEY')
//     this.libraryId = Env.get('BUNNY_STREAM_LIBRARY_ID')
//     this.baseUrl = Env.get('BUNNY_STREAM_BASE_URL', 'https://video.bunnycdn.com')
//   }

//   /**
//    * Create a new video in Bunny Stream
//    */
//   public async createVideo(title: string, collectionId?: string): Promise<BunnyVideoUploadResponse> {
//     try {
//       const requestBody: any = { title }
//       if (collectionId) {
//         requestBody.collectionId = collectionId
//       }

//       const response: AxiosResponse<BunnyVideoUploadResponse> = await axios.post(
//         `${this.baseUrl}/library/${this.libraryId}/videos`,
//         requestBody,
//         {
//           headers: {
//             AccessKey: this.apiKey,
//             'Content-Type': 'application/json',
//           },
//         }
//       )

//       return response.data
//     } catch (error) {
//       throw new Error(`Failed to create video: ${error.response?.data?.message || error.message}`)
//     }
//   }

//   /**
//    * Upload video from URL to Bunny Stream
//    */
//   public async uploadVideoFromUrl(
//     videoId: string,
//     videoUrl: string
//   ): Promise<BunnyUploadUrlResponse> {
//     try {
//       const response: AxiosResponse<BunnyUploadUrlResponse> = await axios.post(
//         `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}/fetch`,
//         {
//           url: videoUrl,
//         },
//         {
//           headers: {
//             AccessKey: this.apiKey,
//             'Content-Type': 'application/json',
//           },
//         }
//       )

//       return response.data
//     } catch (error) {
//       throw new Error(
//         `Failed to upload video from URL: ${error.response?.data?.message || error.message}`
//       )
//     }
//   }

//   /**
//    * Get video details
//    */
//   public async getVideo(videoId: string): Promise<BunnyVideoUploadResponse> {
//     try {
//       const response: AxiosResponse<BunnyVideoUploadResponse> = await axios.get(
//         `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`,
//         {
//           headers: {
//             AccessKey: this.apiKey,
//           },
//         }
//       )

//       return response.data
//     } catch (error) {
//       throw new Error(`Failed to get video: ${error.response?.data?.message || error.message}`)
//     }
//   }

//   /**
//    * Delete video from Bunny Stream
//    */
//   public async deleteVideo(videoId: string): Promise<{ message: string }> {
//     try {
//       const response = await axios.delete(
//         `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`,
//         {
//           headers: {
//             AccessKey: this.apiKey,
//           },
//         }
//       )

//       return { message: 'Video deleted successfully' }
//     } catch (error) {
//       throw new Error(`Failed to delete video: ${error.response?.data?.message || error.message}`)
//     }
//   }

//   /**
//    * List all videos in the library
//    */
//   public async listVideos(
//     page: number = 1,
//     itemsPerPage: number = 100,
//     search?: string,
//     collection?: string,
//     orderBy?: string
//   ): Promise<{
//     items: BunnyVideoUploadResponse[]
//     currentPage: number
//     itemsPerPage: number
//     totalItems: number
//   }> {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         itemsPerPage: itemsPerPage.toString(),
//       })

//       if (search) params.append('search', search)
//       if (collection) params.append('collection', collection)
//       if (orderBy) params.append('orderBy', orderBy)

//       const response = await axios.get(
//         `${this.baseUrl}/library/${this.libraryId}/videos?${params.toString()}`,
//         {
//           headers: {
//             AccessKey: this.apiKey,
//           },
//         }
//       )

//       return response.data
//     } catch (error) {
//       throw new Error(`Failed to list videos: ${error.response?.data?.message || error.message}`)
//     }
//   }

//   /**
//    * Update video details
//    */
//   public async updateVideo(
//     videoId: string,
//     updates: {
//       title?: string
//       collectionId?: string
//       chapters?: any[]
//       moments?: any[]
//       metaTags?: any[]
//     }
//   ): Promise<BunnyVideoUploadResponse> {
//     try {
//       const response: AxiosResponse<BunnyVideoUploadResponse> = await axios.post(
//         `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`,
//         updates,
//         {
//           headers: {
//             AccessKey: this.apiKey,
//             'Content-Type': 'application/json',
//           },
//         }
//       )

//       return response.data
//     } catch (error) {
//       throw new Error(`Failed to update video: ${error.response?.data?.message || error.message}`)
//     }
//   }
// }
