import {
  Controller,
  Get,
  Delete,
  Post,
  UploadedFile,
  HttpCode,
  UseInterceptors,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

const allowMEMEType = ['jpg', 'png', 'xlsx'];

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  async getFiles(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const files = await this.fileService.getFiles(offset, limit);
    return files.map(file => file.getFileInfo());
  }

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('files', {
      fileFilter: (_, file, callback) => {
        const type = file.originalname.match(/\.(\w+)$/)?.[1];
        if (type && !allowMEMEType.includes(type)) {
          callback(new Error('Недопустимый тип файла ' + type), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5_000_000 },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.fileService.saveFile(file);
  }

  @Delete('changeDeleteStatus/:id')
  changeDeleteStatus(
    @Param('id') id: string,
    @Query('isDelete') isDelete: boolean,
  ) {
    return this.fileService.changeDeleteStatus(id, isDelete);
  }

  @Delete('deleteAllMarkedFiles')
  deleteAllMarkedFiles() {
    return this.fileService.deleteFiles();
  }
}
