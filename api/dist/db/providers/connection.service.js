"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionService = void 0;
const fastify_decorators_1 = require("fastify-decorators");
const configuration_1 = require("../../config/configuration");
const typeorm_1 = require("typeorm");
const { database: { type: dbType, host, port, username, password, database, entities } } = configuration_1.default();
let ConnectionService = class ConnectionService {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield typeorm_1.createConnection({
                type: dbType,
                host,
                port,
                username,
                password,
                database,
                entities,
                synchronize: true,
            });
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.close();
        });
    }
};
__decorate([
    fastify_decorators_1.Initializer(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConnectionService.prototype, "init", null);
__decorate([
    fastify_decorators_1.Destructor(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConnectionService.prototype, "destroy", null);
ConnectionService = __decorate([
    fastify_decorators_1.Service()
], ConnectionService);
exports.ConnectionService = ConnectionService;
//# sourceMappingURL=connection.service.js.map