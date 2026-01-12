import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmergencyContactsModule } from './modules/emergency-contacts/emergency-contacts.module';
import { SOSModule } from './modules/sos/sos.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { DatabaseModule } from './config/database.module';
import { appConfig, jwtConfig, twilioConfig, smtpConfig, throttleConfig, corsConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, twilioConfig, smtpConfig, throttleConfig, corsConfig],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config) => ({
        ttl: config.get('throttle.ttl'),
        limit: config.get('throttle.limit'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    EmergencyContactsModule,
    SOSModule,
    IncidentsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
