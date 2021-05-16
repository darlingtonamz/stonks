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
exports.UsersController = void 0;
const fastify_decorators_1 = require("fastify-decorators");
const user_dto_1 = require("../dtos/user.dto");
const users_service_1 = require("../providers/users.service");
let UsersController = class UsersController {
    constructor(service) {
        this.service = service;
    }
    getOne({ params }, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            reply.status(201);
            return this.service.getOneUser({ id: params['id'] });
        });
    }
    createOne({ body }, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            reply.status(201);
            return this.service.createOneUser(body);
        });
    }
};
__decorate([
    fastify_decorators_1.GET('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOne", null);
__decorate([
    fastify_decorators_1.POST('/', {
        schema: {
            body: user_dto_1.CreateUserSchema,
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createOne", null);
UsersController = __decorate([
    fastify_decorators_1.Controller({ route: '/users' }),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map