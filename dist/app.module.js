"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("./auth/auth.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const abuse_module_1 = require("./abuse/abuse.module");
const admin_module_1 = require("./admin/admin.module");
const health_controller_1 = require("./health/health.controller");
const manager_entity_1 = require("./entities/manager.entity");
const subscriber_entity_1 = require("./entities/subscriber.entity");
const code_entity_1 = require("./entities/code.entity");
const service_fee_summary_entity_1 = require("./entities/service-fee-summary.entity");
const audit_log_entity_1 = require("./entities/audit-log.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60,
                    limit: 100,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    url: config.get('DATABASE_URL'),
                    ssl: { rejectUnauthorized: false },
                    entities: [
                        manager_entity_1.Manager,
                        subscriber_entity_1.Subscriber,
                        code_entity_1.Code,
                        service_fee_summary_entity_1.ServiceFeeSummary,
                        audit_log_entity_1.AuditLog,
                    ],
                    synchronize: true,
                    logging: false,
                    extra: { max: 10 },
                }),
            }),
            auth_module_1.AuthModule,
            audit_logs_module_1.AuditLogsModule,
            abuse_module_1.AbuseModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map