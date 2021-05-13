"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesService = void 0;
const fastify_decorators_1 = require("fastify-decorators");
let TradesService = class TradesService {
    hello(body) {
        return `Hello world! ${body}`;
    }
};
TradesService = __decorate([
    fastify_decorators_1.Service()
], TradesService);
exports.TradesService = TradesService;
//# sourceMappingURL=trades.service.js.map