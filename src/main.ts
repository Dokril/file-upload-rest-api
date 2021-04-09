import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppClusterService } from './cluster.service';
import { AllExceptionsFilter } from './exceptions.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
AppClusterService.clusterize(bootstrap);
