import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class FileUploadService {
  private readonly uploadPath: string;

  constructor() {
    this.uploadPath = './uploads';

    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      // Validate file type
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // Validate file type for company logo
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type. Only JPEG, PNG, and GIF files are allowed',
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new BadRequestException(
          'File size too large. Maximum size is 5MB',
        );
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
      const filePath = path.join(this.uploadPath, fileName);

      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Return relative path
      return `/uploads/${fileName}`;
    } catch (error) {
      throw new BadRequestException(
        `File upload failed: ${(error as Error).message}`,
      );
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (!filePath) return;

      const fullPath = path.join(process.cwd(), filePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      // Log error but don't throw to avoid breaking other operations
      console.error('Error deleting file:', error);
    }
  }

  getFilePath(fileName: string): string {
    return `/uploads/${fileName}`;
  }
}