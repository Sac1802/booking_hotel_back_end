import { Module, Logger } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): MongooseModuleFactoryOptions => {
        const uri = config.get<string>('URL_DATABASE');

        if (!uri) {
          throw new Error('URL_DATABASE is not defined');
        }

        Logger.log('Connecting to MongoDB...', 'DatabaseModule');

        return {
          uri,
          connectionFactory: (connection: Connection) => {
            Logger.log('MongoDB connected successfully', 'DatabaseModule');
            return connection;
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
