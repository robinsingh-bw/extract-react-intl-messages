"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
test('errors', async () => {
    // @ts-ignore
    await expect(__1.default('hello')).rejects.toThrow('Expected a Array');
    // @ts-ignore
    await expect(__1.default(['en', 'ja'], 2)).rejects.toThrow('Expected a string');
    // @ts-ignore
    await expect(__1.default(['en', 'ja'], 'app/', 2)).rejects.toThrow('Expected a string');
});
//# sourceMappingURL=test.js.map