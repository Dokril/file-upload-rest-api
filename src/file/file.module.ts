import { FileController } from './file.controller';
import { FileService } from './file.service';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { FileModel } from './models/file.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: FileModel,
        schemaOptions: {
          collection: 'files',
        },
      },
    ]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
