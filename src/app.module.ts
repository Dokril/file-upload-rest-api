import { FileModule } from './file/file.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConnect, getMongoOptions } from './configs/mongo.config';

@Module({
  imports: [
    FileModule,
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: getMongoConnect(configService),
        ...getMongoOptions(),
      }),
    }),
  ],
})
export class AppModule {}
