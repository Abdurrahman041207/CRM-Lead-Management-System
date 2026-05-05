import {
  Controller, Get, Post, Body,
  Param, ParseIntPipe, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('leads/:leadId/notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  create(
    @Param('leadId', ParseIntPipe) leadId: number,
    @Body() dto: CreateNoteDto,
    @Request() req,
  ) {
    return this.notesService.create(leadId, dto, req.user.id);
  }

  @Get()
  findAll(@Param('leadId', ParseIntPipe) leadId: number, @Request() req) {
    return this.notesService.findAllForLead(leadId, req.user.id);
  }
}
