import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto, userId: number) {
    return this.prisma.lead.create({
      data: {
        ...dto,
        assignedToId: userId,
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
  }

  async findAll(userId: number) {
    return this.prisma.lead.findMany({
      where: { assignedToId: userId },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, assignedToId: userId },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        notes: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async update(id: number, dto: UpdateLeadDto, userId: number) {
    await this.findOne(id, userId); // ensures it exists & belongs to user

    return this.prisma.lead.update({
      where: { id },
      data: dto,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.lead.delete({ where: { id } });
  }
}
