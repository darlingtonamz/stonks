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
exports.UsersService = void 0;
const fastify_decorators_1 = require("fastify-decorators");
const user_entity_1 = require("../entities/user.entity");
const connection_service_1 = require("../../db/providers/connection.service");
let UsersService = class UsersService {
    constructor(connectionService) {
        this.connectionService = connectionService;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.repository = this.connectionService.connection.getRepository(user_entity_1.UserEntity);
        });
    }
    getOneUser(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            try {
                user = yield this.repository.findOne(query, options);
            }
            catch (e) {
                throw { statusCode: 500, message: e };
            }
            if (!user) {
                throw { statusCode: 404, message: `User ${JSON.stringify(query)} not found` };
            }
            return user;
        });
    }
    createOneUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.save(this.repository.merge(new user_entity_1.UserEntity(), body));
        });
    }
};
__decorate([
    fastify_decorators_1.Initializer([connection_service_1.ConnectionService]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "init", null);
UsersService = __decorate([
    fastify_decorators_1.Service(),
    __metadata("design:paramtypes", [connection_service_1.ConnectionService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map