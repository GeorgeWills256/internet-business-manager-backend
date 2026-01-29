"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Internet Business Manager API')
        .setDescription('Backend API for authentication, managers, subscribers, payments, audit logs, and health checks')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server running on http://127.0.0.1:${port}`);
    console.log(`📘 Swagger docs available at http://127.0.0.1:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map