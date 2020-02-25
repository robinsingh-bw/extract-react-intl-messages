"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const lodash_pick_1 = __importDefault(require("lodash.pick"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const pify_1 = __importDefault(require("pify"));
const flat_1 = require("flat");
const load_json_file_1 = __importDefault(require("load-json-file"));
const write_json_file_1 = __importDefault(require("write-json-file"));
const sort_keys_1 = __importDefault(require("sort-keys"));
const extract_react_intl_1 = __importDefault(require("./extract-react-intl"));
const writeJson = (outputPath, obj) => {
    return write_json_file_1.default(`${outputPath}.json`, obj, { indent: 2 });
};
const writeYaml = (outputPath, obj) => {
    return pify_1.default(fs_1.default.writeFile)(`${outputPath}.yml`, js_yaml_1.default.safeDump(obj), 'utf8');
};
const isJson = (ext) => ext === 'json';
function loadLocaleFiles(locales, buildDir, ext) {
    const oldLocaleMaps = {};
    try {
        mkdirp_1.default.sync(buildDir);
    }
    catch (error) { }
    for (const locale of locales) {
        const file = path_1.default.resolve(buildDir, `${locale}.${ext}`);
        // Initialize json file
        try {
            const output = isJson(ext) ? JSON.stringify({}) : js_yaml_1.default.safeDump({});
            fs_1.default.writeFileSync(file, output, { flag: 'wx' });
        }
        catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
        let messages = isJson(ext)
            ? load_json_file_1.default.sync(file)
            : js_yaml_1.default.safeLoad(fs_1.default.readFileSync(file, 'utf8'), { json: true });
        messages = flat_1.flatten(messages);
        oldLocaleMaps[locale] = {};
        for (const messageKey of Object.keys(messages)) {
            const message = messages[messageKey];
            if (message && typeof message === 'string' && message !== '') {
                oldLocaleMaps[locale][messageKey] = messages[messageKey];
            }
        }
    }
    return oldLocaleMaps;
}
// eslint-disable-next-line max-lines-per-function
const extractMessage = async (locales, pattern, buildDir, _a = {
    defaultLocale: 'en'
}) => {
    var { format = 'json', flat = isJson(format), defaultLocale = 'en' } = _a, opts = __rest(_a, ["format", "flat", "defaultLocale"]);
    if (!Array.isArray(locales)) {
        throw new TypeError(`Expected a Array, got ${typeof locales}`);
    }
    if (typeof pattern !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof pattern}`);
    }
    if (typeof buildDir !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof buildDir}`);
    }
    const ext = isJson(format) ? 'json' : 'yml';
    const oldLocaleMaps = loadLocaleFiles(locales, buildDir, ext);
    const extractorOptions = Object.assign({ defaultLocale, withDescriptions: false, cwd: process.cwd(), extractFromFormatMessageCall: true }, opts);
    const newLocaleMaps = await extract_react_intl_1.default(locales, pattern, extractorOptions);
    return Promise.all(locales.map(locale => {
        // If the default locale, overwrite the origin file
        let localeMap = locale === defaultLocale
            ? // Create a clone so we can use only current valid messages below
             Object.assign({ '#I18N#': 'This file is overridden by strings inside components - do not modify!' }, newLocaleMaps[locale]) : Object.assign(Object.assign({}, newLocaleMaps[locale]), lodash_pick_1.default(oldLocaleMaps[locale], Object.keys(newLocaleMaps[locale]))); // Only keep existing keys
        const fomattedLocaleMap = flat
            ? localeMap
            : flat_1.unflatten(sort_keys_1.default(localeMap), { object: true });
        const fn = isJson(format) ? writeJson : writeYaml;
        return fn(path_1.default.resolve(buildDir, locale), fomattedLocaleMap);
    }));
};
extractMessage.extractReactIntl = extract_react_intl_1.default;
exports.default = extractMessage;
// For CommonJS default export support
module.exports = extractMessage;
module.exports.default = extractMessage;
//# sourceMappingURL=index.js.map