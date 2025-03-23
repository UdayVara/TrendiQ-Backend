// src/services/cloudinary.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from 'src/config/cloudinary.config';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File,productId?:string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'trendiq',filename: productId}, // Optional: Specify a folder in Cloudinary
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadMultipleImages(files: Express.Multer.File[], productId?: string): Promise<UploadApiResponse[]> {
    const uploadPromises = files.map((file, index) =>
      new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'trendiq',
              filename: productId ? `${productId}_${index}` : undefined,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          )
          .end(file.buffer);
      }),
    );
  
    return Promise.all(uploadPromises);
  }
  
  async deleteImage(publicId: string): Promise<{ result: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(
            new BadRequestException(`Failed to delete image: ${error.message}`),
          );
        } else {
          resolve(result);
        }
      });
    });
  }

  async deleteMultipleImages(publicIds: string[]): Promise<{ result: string }[]> {
    const deletePromises = publicIds.map((publicId) =>
      new Promise<{ result: string }>((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            reject(
              new BadRequestException(`Failed to delete image: ${error.message}`),
            );
          } else {
            resolve(result);
          }
        });
      }),
    );
  
    return Promise.all(deletePromises);
  }
  
}
