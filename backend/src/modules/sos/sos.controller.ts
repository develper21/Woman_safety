import { Controller, Post, UseGuards, Body, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SOSService } from './sos.service';
import { CreateSOSDto } from './dto/create-sos.dto';

@Controller('sos')
@UseGuards(JwtAuthGuard)
export class SOSController {
  constructor(private readonly sosService: SOSService) {}

  @Post('activate')
  async activateSOS(@Body() createSOSDto: CreateSOSDto) {
    // Mock implementation for now
    return {
      message: 'SOS activated successfully',
      sessionId: 'mock-session-id',
      status: 'active',
    };
  }

  @Post('deactivate/:sessionId')
  async deactivateSOS(@Param('sessionId') sessionId: string) {
    // Mock implementation for now
    return {
      message: 'SOS deactivated successfully',
      sessionId,
      status: 'deactivated',
    };
  }

  @Post('location/:sessionId')
  async updateLocation(
    @Param('sessionId') sessionId: string,
    @Body() locationData: { latitude: number; longitude: number; accuracy: number }
  ) {
    // Mock implementation for now
    return {
      message: 'Location updated successfully',
      sessionId,
      location: locationData,
    };
  }

  @Get('active/:userId')
  async getActiveSOS(@Param('userId') userId: string) {
    // Mock implementation for now
    return {
      sessionId: null,
      status: 'inactive',
    };
  }
}
