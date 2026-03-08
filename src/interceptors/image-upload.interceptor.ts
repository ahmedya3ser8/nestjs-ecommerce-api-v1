import { BadRequestException, Type } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

/**
 * Reusable ImageUploadInterceptor
 * @param fieldName - form-data key for the file
 * @param maxSizeMB - max file size in MB (default 1MB)
*/
export function ImageUploadInterceptor(fieldName: string, maxSizeMB: number = 1): Type<any> {
  return FileInterceptor(fieldName, {
    storage: memoryStorage(),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image')) {
        return cb(new BadRequestException('Unsupported file type'), false);
      }
      cb(null, true);
    },
  })
}

export function ImageFieldsUploadInterceptor(fields: { name: string; maxCount: number }[], maxSizeMB: number = 2): Type<any> {
  return FileFieldsInterceptor(fields, {
    storage: memoryStorage(),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image')) {
        return cb(new BadRequestException('Unsupported file type'), false);
      }
      cb(null, true);
    },
  });
}