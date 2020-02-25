"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tempy_1 = __importDefault(require("tempy"));
const __1 = __importDefault(require("../.."));
test('export json', async () => {
    const tmp = tempy_1.default.directory();
    await __1.default(['en', 'ja'], 'src/test/fixtures/default/**/*.js', tmp);
    const en = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(tmp, 'en.json'), 'utf8'));
    const ja = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(tmp, 'ja.json'), 'utf8'));
    expect(en).toMatchSnapshot();
    expect(ja).toMatchSnapshot();
});
test('export json with removed messages', async () => {
    const tmp = tempy_1.default.directory();
    await __1.default(['en', 'ja'], 'src/test/fixtures/default/**/*.js', tmp);
    const enBefore = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(tmp, 'en.json'), 'utf8'));
    const jaBefore = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(tmp, 'ja.json'), 'utf8'));
    expect(enBefore).toMatchSnapshot();
    expect(jaBefore).toMatchSnapshot();
    await __1.default(['en', 'ja'], 'src/test/fixtures/removed/**/*.js', tmp);
    const en = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(tmp, 'en.json'), 'utf8'));
    const ja = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(tmp, 'ja.json'), 'utf8'));
    expect(en).toMatchSnapshot();
    expect(ja).toMatchSnapshot();
});
test('export json - nest', async () => {
    const tmp = tempy_1.default.directory();
    await __1.default(['en', 'ja'], 'src/test/fixtures/default/**/*.js', tmp, {
        defaultLocale: 'en',
        flat: false
    });
    const en = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(tmp, 'en.json'), 'utf8'));
    const ja = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(tmp, 'ja.json'), 'utf8'));
    expect(en).toMatchSnapshot();
    expect(ja).toMatchSnapshot();
});
test('sort keys', async () => {
    const tmp = tempy_1.default.directory();
    const enPath = path_1.default.resolve(tmp, 'en.json');
    const jaPath = path_1.default.resolve(tmp, 'ja.json');
    await __1.default(['en', 'ja'], 'src/test/fixtures/unsorted/**/*.js', tmp);
    const en = JSON.parse(fs_1.default.readFileSync(enPath, 'utf8'));
    const ja = JSON.parse(fs_1.default.readFileSync(jaPath, 'utf8'));
    expect(Object.keys(en)).toMatchSnapshot();
    expect(Object.keys(ja)).toMatchSnapshot();
});
test('export using custom module', async () => {
    const tmp = tempy_1.default.directory();
    await __1.default(['en', 'ja'], 'src/test/fixtures/custom/**/*.js', tmp, {
        defaultLocale: 'en',
        moduleSourceName: '../i18n'
    });
    const en = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(tmp, 'en.json'), 'utf8'));
    const ja = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(tmp, 'ja.json'), 'utf8'));
    expect(en).toMatchSnapshot();
    expect(ja).toMatchSnapshot();
});
//# sourceMappingURL=test.js.map