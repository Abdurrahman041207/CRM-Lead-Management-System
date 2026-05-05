import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(leadId: number, dto: CreateNoteDto, userId: number) {
    // Verify lead exists and belongs to user
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, assignedToId: userId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    return this.prisma.note.create({
      data: {
        content: dto.content,
        leadId,
      },
    });
  }

  async findAllForLead(leadId: number, userId: number) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, assignedToId: userId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    return this.prisma.note.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
