import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

@Injectable()
export class CloudinaryService {
  public async uploadSingleImage(file: Express.Multer.File, folder: string) {
    return new Promise<CloudinaryUploadResult>((reslove, reject) => {
      cloudinary.uploader.upload_stream(
        { folder }, 
        (error, result) => {
          if (error || !result) {
            return reject(new InternalServerErrorException('Cloudinary upload failed'))
          }
          reslove({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      ).end(file.buffer)
    })
  }

  public async uploadMultipleImages(files: Express.Multer.File[], folder: string): Promise<CloudinaryUploadResult[]> {
    const uploads = files.map(file => this.uploadSingleImage(file, folder));
    return Promise.all(uploads);
  }

  public async deleteSingleImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId)
  }
}
