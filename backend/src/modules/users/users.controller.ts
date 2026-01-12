import { Controller, Get, UseGuards, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@Param('id') id: string) {
    // For now, return a mock profile since we don't have user context
    return {
      id: 1,
      name: 'Test User',
      phone: '+1234567890',
      email: 'test@example.com',
      isVerified: true,
    };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    // For now, return mock updated profile
    return {
      id: 1,
      name: updateProfileDto.name || 'Test User',
      phone: '+1234567890',
      email: updateProfileDto.email || 'test@example.com',
      isVerified: true,
    };
  }
}
