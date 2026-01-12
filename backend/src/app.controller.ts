import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is running' })
  getHealth(): { status: string; message: string; timestamp: string } {
    return {
      status: 'ok',
      message: 'PPDU Backend API is running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Detailed health check' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  getDetailedHealth(): {
    status: string;
    message: string;
    version: string;
    timestamp: string;
  } {
    return {
      status: 'healthy',
      message: 'PPDU Women Safety Backend API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
