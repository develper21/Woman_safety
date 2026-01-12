import { Controller, Post, Get, Delete, UseGuards, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Controller('incidents')
@UseGuards(JwtAuthGuard)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  async createIncident(@Body() createIncidentDto: CreateIncidentDto) {
    // Mock implementation for now
    return {
      message: 'Incident created successfully',
      incidentId: 'mock-incident-id',
      ...createIncidentDto,
    };
  }

  @Get()
  async getIncidents() {
    // Mock implementation for now
    return {
      incidents: [],
      message: 'Incidents retrieved successfully',
    };
  }

  @Delete(':incidentId')
  async deleteIncident(@Param('incidentId') incidentId: string) {
    // Mock implementation for now
    return {
      message: 'Incident deleted successfully',
      incidentId,
    };
  }
}
