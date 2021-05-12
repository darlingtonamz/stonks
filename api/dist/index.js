"use strict";
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
require("reflect-metadata");
const fastify_1 = require("fastify");
const configuration_1 = require("./config/configuration");
const PORT = configuration_1.default().port;
const server = fastify_1.default({ logger: true });
const opts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
server.get('/health', opts, () => __awaiter(void 0, void 0, void 0, function* () {
    return { pong: 'it worked!' };
}));
server.get('/ping', opts, () => __awaiter(void 0, void 0, void 0, function* () {
    return { pong: 'it worked!' };
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.listen(PORT);
        console.log(`API running at port ${PORT}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
});
start();
//# sourceMappingURL=index.js.map