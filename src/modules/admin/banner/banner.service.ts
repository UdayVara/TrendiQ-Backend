import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AddBannerDto } from './dto/addBanner.dto';

@Injectable()
export class BannerService {
    constructor(private readonly prisma: PrismaService,private readonly cloudinary:CloudinaryService) {}

    async addBanner(mobile:Express.Multer.File,defaultImage:Express.Multer.File,body:AddBannerDto){
        try {
            
        
        const uploadMobileImage = await this.cloudinary.uploadImage(mobile,'/banner/mobile');
        const uploadDefaultImage = await this.cloudinary.uploadImage(defaultImage,'/banner/default');

        const banner = await this.prisma.banner.create({
            data:{
                defaultImage:uploadDefaultImage.secure_url,
                defaultPublicId:uploadDefaultImage.public_id,
                mobileImage:uploadMobileImage.secure_url,
                mobilePublicId:uploadMobileImage.public_id,
                gender:body.gender
            }
        })

        if(banner){
            return {statusCode:201,message:"Banner Images Added Successfully"}
        }else{
            await this.cloudinary.deleteImage(uploadMobileImage.public_id);
            await this.cloudinary.deleteImage(uploadDefaultImage.public_id);
            return {statusCode:500,message:"Unexpected Error Occured"}  
        }
    } catch (error) {
        throw new InternalServerErrorException(error?.message || "Unexpected Error Occured");
    }
    }

    async getBanners(){
        try {
            const banner = await this.prisma.banner.findMany({})
            if(banner){
                return {statusCode:200,message:"Banner Fetched Successfully",data:banner}
            }else{
                return {statusCode:500,message:"Unexpected Error Occured"}
            }
        } catch (error) {
            throw new InternalServerErrorException(error?.message || "Unexpected Error Occured");
        }
    }

    async deleteBanner(id:string){
        try {
            const banner = await this.prisma.banner.findFirst({
                where:{
                    id:id
                }
            })
            if(banner){
                await this.cloudinary.deleteImage(banner.defaultPublicId);
                await this.cloudinary.deleteImage(banner.mobilePublicId);
                await this.prisma.banner.delete({
                    where:{
                        id:id
                    }
                })
                return {statusCode:201,message:"Banner Deleted Successfully"}
            }else{
                return {statusCode:500,message:"Unexpected Error Occured"}
            }
        } catch (error) {
            throw new InternalServerErrorException(error?.message || "Unexpected Error Occured");
        }
    }
}
