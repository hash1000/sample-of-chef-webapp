import { BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export function ensureUploadsDir() {
  const uploadRoot = join(process.cwd(), 'uploads');
  if (!existsSync(uploadRoot)) mkdirSync(uploadRoot, { recursive: true });
  return uploadRoot;
}

export function localImageUploadOptions(folder: string) {
  return {
    storage: diskStorage({
      destination: (_req: any, _file: any, callback: (error: Error | null, path: string) => void) => {
        const target = join(ensureUploadsDir(), folder);
        if (!existsSync(target)) mkdirSync(target, { recursive: true });
        callback(null, target);
      },
      filename: (_req: any, file: any, callback: (error: Error | null, filename: string) => void) => {
        const extension = extname(file.originalname || '').toLowerCase() || '.jpg';
        const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        callback(null, safeName);
      },
    }),
    fileFilter: (_req: any, file: any, callback: (error: Error | null, acceptFile: boolean) => void) => {
      if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
        callback(new BadRequestException('Only JPG, PNG, WebP, and GIF images are allowed'), false);
        return;
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  };
}
