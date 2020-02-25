"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// eslint-disable-next-line import/no-extraneous-dependencies
const tempy_1 = __importDefault(require("tempy"));
// eslint-disable-next-line import/no-extraneous-dependencies
const temp_write_1 = __importDefault(require("temp-write"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const __1 = __importDefault(require("../.."));
const fixturesPath = 'src/test/fixtures/default/**/*.js';
const yamlLoad = (tmp, file = '') => js_yaml_1.default.safeLoad(fs_1.default.readFileSync(path_1.default.resolve(tmp, file), 'utf8'));
const defaultLocale = 'en';
test('export yaml', async () => {
    const tmp = tempy_1.default.directory();
    await __1.default(['en', 'ja'], fixturesPath, tmp, { defaultLocale, format: 'yaml' });
    expect(yamlLoad(tmp, 'en.yml')).toMatchSnapshot();
    expect(yamlLoad(tmp, 'ja.yml')).toMatchSnapshot();
});
test('export yaml - flat', async () => {
    const tmp = tempy_1.default.directory();
    await __1.default(['en', 'ja'], fixturesPath, tmp, {
        defaultLocale,
        format: 'yaml',
        flat: true
    });
    expect(yamlLoad(tmp, 'en.yml')).toMatchSnapshot();
    expect(yamlLoad(tmp, 'ja.yml')).toMatchSnapshot();
});
test('exsit yaml', async () => {
    const x = { a: { hello: 'hello2' } };
    const tmpEn = temp_write_1.default.sync(js_yaml_1.default.safeDump(x), 'en.yml');
    await __1.default(['en'], fixturesPath, path_1.default.dirname(tmpEn), {
        defaultLocale,
        format: 'yaml'
    });
    expect(js_yaml_1.default.safeLoad(fs_1.default.readFileSync(tmpEn, 'utf8'))).toMatchSnapshot();
    const tmpJa = temp_write_1.default.sync(js_yaml_1.default.safeDump(x), 'ja.yml');
    await __1.default(['ja'], fixturesPath, path_1.default.dirname(tmpJa), {
        defaultLocale,
        format: 'yaml'
    });
    expect(js_yaml_1.default.safeLoad(fs_1.default.readFileSync(tmpJa, 'utf8'))).toMatchSnapshot();
});
//# sourceMappingURL=test.js.map