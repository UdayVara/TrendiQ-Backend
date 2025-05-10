import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { createSupportTicketDto } from './addTicket.dto';

@Injectable()
export class SupportService {
    constructor(private readonly prisma:PrismaService) {}

    async findAll(){
        try {
            const res = await this.prisma.supportTickets.findMany();
            return {statusCode:200,message:"Support Tickets Fetched Successfully",data:res}
        } catch (error) {
            throw new InternalServerErrorException("Failed to Fetch Support Tickets");
        }
        
    }

    async createTicket(userId:string,body:createSupportTicketDto){
        try {
            const res = await this.prisma.supportTickets.create({
                data:{...body,userId}
            })

            if(res){
                return {statusCode:201,message:"Support Ticket Created Successfully. You'll Receive Response in your Email",data:res}
            }else{
                return {statusCode:500,message:"Failed to Create Support Ticket"}
            }
        } catch (error) {
            throw new InternalServerErrorException("Failed to Create Support Ticket");
        }
    }
}
