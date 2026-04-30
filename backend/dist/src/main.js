"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const app_module_1 = require("./app.module");
const local_image_upload_1 = require("./common/local-image-upload");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.use('/uploads', express_1.default.static((0, path_1.join)((0, local_image_upload_1.ensureUploadsDir)())));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    const config = app.get(config_1.ConfigService);
    const port = Number(config.get('PORT') ?? 4000);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map