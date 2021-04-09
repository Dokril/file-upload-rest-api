import { ConfigService } from '@nestjs/config';
import { TypegooseConnectionOptions } from 'nestjs-typegoose';

export const getMongoConnect = (configService: ConfigService) =>
  'mongodb://' +
  configService.get('MONGO_LOGIN') +
  ':' +
  configService.get('MONGO_PASSWORD') +
  '@' +
  configService.get('MONGO_HOST') +
  ':' +
  configService.get('MONGO_PORT') +
  '/' +
  configService.get('MONGO_DATABASE') +
  '?authSource=' +
  configService.get('MONGO_AUTHDATABASE');

export const getMongoOptions = (): TypegooseConnectionOptions => ({
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
