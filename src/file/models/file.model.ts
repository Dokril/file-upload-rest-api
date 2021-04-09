import { mongoose, prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { format } from 'date-fns';

export class FileModel extends TimeStamps implements Base {
  constructor(fileData: Express.Multer.File) {
    super();
    this.file = fileData.buffer;
    this.name = fileData.originalname;
    this.size = fileData.size;
    this.anyProperty = {
      ...fileData,
      buffer: undefined,
      originalname: undefined,
      size: undefined,
    };
  }
  _id: Types.ObjectId;
  __v?: number | undefined;
  __t?: string | number | undefined;

  @prop()
  file: Buffer;
  @prop()
  name: string;
  @prop()
  size: number;
  @prop({ default: () => false })
  isDelete: boolean;
  @prop({ type: mongoose.Schema.Types.Mixed })
  anyProperty: object;

  getFileInfo() {
    return {
      id: this._id,
      createdAt: this.createdAt
        ? format(this.createdAt, 'dd.MM.yyyy hh:mm')
        : undefined,
      name: this.name,
      size: this.getSizeString(),
    };
  }
  getSizeString(): string {
    if (this.size > 1_000_000) return `${this.size / 1_000_000} mb`;
    if (this.size > 1_000) return `${this.size / 1_000} kb`;
    return `${this.size} byte`;
  }
}
