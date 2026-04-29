"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUploadsDir = ensureUploadsDir;
exports.localImageUploadOptions = localImageUploadOptions;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const multer_1 = require("multer");
const path_1 = require("path");
const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
function ensureUploadsDir() {
    const uploadRoot = (0, path_1.join)(process.cwd(), 'uploads');
    if (!(0, fs_1.existsSync)(uploadRoot))
        (0, fs_1.mkdirSync)(uploadRoot, { recursive: true });
    return uploadRoot;
}
function localImageUploadOptions(folder) {
    return {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, callback) => {
                const target = (0, path_1.join)(ensureUploadsDir(), folder);
                if (!(0, fs_1.existsSync)(target))
                    (0, fs_1.mkdirSync)(target, { recursive: true });
                callback(null, target);
            },
            filename: (_req, file, callback) => {
                const extension = (0, path_1.extname)(file.originalname || '').toLowerCase() || '.jpg';
                const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
                callback(null, safeName);
            },
        }),
        fileFilter: (_req, file, callback) => {
            if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
                callback(new common_1.BadRequestException('Only JPG, PNG, WebP, and GIF images are allowed'), false);
                return;
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    };
}
//# sourceMappingURL=local-image-upload.js.map