import { Controller, Get, Post, Put, Delete, UseGuards, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmergencyContactsService } from './emergency-contacts.service';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto';

@Controller('emergency-contacts')
@UseGuards(JwtAuthGuard)
export class EmergencyContactsController {
  constructor(private readonly emergencyContactsService: EmergencyContactsService) {}

  @Get()
  async getEmergencyContacts() {
    // Mock implementation for now
    return {
      contacts: [],
      message: 'Emergency contacts retrieved successfully',
    };
  }

  @Post()
  async createEmergencyContact(@Body() createContactDto: CreateEmergencyContactDto) {
    // Mock implementation for now
    return {
      message: 'Emergency contact created successfully',
      contactId: 'mock-contact-id',
      ...createContactDto,
    };
  }

  @Put(':contactId')
  async updateEmergencyContact(
    @Param('contactId') contactId: string,
    @Body() updateData: { name?: string; phone?: string; relationship?: string }
  ) {
    // Mock implementation for now
    return {
      message: 'Emergency contact updated successfully',
      contactId,
      ...updateData,
    };
  }

  @Delete(':contactId')
  async deleteEmergencyContact(@Param('contactId') contactId: string) {
    // Mock implementation for now
    return {
      message: 'Emergency contact deleted successfully',
      contactId,
    };
  }
}
