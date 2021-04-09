import { Injectable, Logger } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { FileModel } from './models/file.model';

@Injectable()
export class FileService {
  logger = new Logger(FileService.name);
  constructor(
    @InjectModel(FileModel) private readonly fileModel: ModelType<FileModel>,
  ) {}

  async saveFile(file: Express.Multer.File) {
    const newFile = await new this.fileModel(await new FileModel(file)).save();
    this.logger.log(`Save file id: ${newFile.id}`);
    return newFile;
  }

  async getFiles(offset: number, limit: number) {
    return this.fileModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async changeDeleteStatus(id: string, isDelete: boolean) {
    const changedDocument = await this.fileModel.findByIdAndUpdate(
      id,
      { isDelete },
      { new: true },
    );

    if (!changedDocument) {
      throw new Error(`File ${id} not found!`);
    }

    this.logger.log(
      `File id: ${changedDocument.id} isDelete = ${changedDocument.isDelete}`,
    );
  }

  async deleteFiles() {
    const result = await this.fileModel.deleteMany({ isDelete: true });
    this.logger.log(`Deleted ${result.deletedCount} files`);
  }
}
