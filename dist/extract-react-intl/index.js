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
const glob_1 = __importDefault(require("glob"));
const pify_1 = __importDefault(require("pify"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const lodash_mergewith_1 = __importDefault(require("lodash.mergewith"));
const core_1 = require("@babel/core");
const read_babelrc_up_1 = __importDefault(require("read-babelrc-up"));
const babel_plugin_react_intl_1 = __importDefault(require("./babel-plugin-react-intl"));
const babel_preset_react_app_1 = __importDefault(require("babel-preset-react-app"));
const localeMap = (arr) => arr.reduce((obj, x) => {
    obj[x] = {};
    return obj;
}, {});
const concatArray = (obj, src) => {
    if (Array.isArray(obj)) {
        return obj.concat(src);
    }
    return undefined;
};
const createResolveList = (fn) => (list, cwd) => list.map(x => (typeof x === 'string' ? fn(x, cwd) : x));
const resolvePresets = createResolveList(core_1.resolvePreset);
const resolvePlugins = createResolveList(core_1.resolvePlugin);
const getBabelrc = (cwd) => {
    try {
        const babelrc = read_babelrc_up_1.default.sync({ cwd }).babel;
        if (!babelrc.env) {
            return babelrc;
        }
        const env = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
        return lodash_mergewith_1.default(babelrc, babelrc.env[env], concatArray);
    }
    catch (error) {
        return { presets: [], plugins: [] };
    }
};
const getBabelrcDir = (cwd) => path_1.default.dirname(read_babelrc_up_1.default.sync({ cwd }).path);
const babelPluginReactIntlOptions = [
    'moduleSourceName',
    'extractSourceLocation',
    'messagesDir',
    'overrideIdFn',
    'removeDefaultMessage',
    'extractFromFormatMessageCall',
    'additionalComponentNames'
];
// eslint-disable-next-line max-lines-per-function
exports.default = async (locales, pattern, _a = {}) => {
    var { defaultLocale = 'en', withDescriptions = false, cwd = process.cwd() } = _a, pluginOptions = __rest(_a, ["defaultLocale", "withDescriptions", "cwd"]);
    if (!Array.isArray(locales)) {
        throw new TypeError(`Expected a Array, got ${typeof locales}`);
    }
    if (typeof pattern !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof pattern}`);
    }
    const babelrc = getBabelrc(cwd) || {};
    const babelrcDir = getBabelrcDir(cwd);
    const presets = babelrc.presets || [];
    const plugins = babelrc.plugins || [];
    presets.unshift({
        plugins: [
            [
                babel_plugin_react_intl_1.default,
                Object.entries(pluginOptions).reduce((acc, [key, value]) => {
                    if (babelPluginReactIntlOptions.includes(key)) {
                        return Object.assign(Object.assign({}, acc), { [key]: value });
                    }
                    return acc;
                }, {})
            ],
        ],
        presets: [
            babel_preset_react_app_1.default
        ]
    });
    const extractFromFile = async (file) => {
        const babelOpts = {
            presets: resolvePresets(presets, babelrcDir),
            plugins: resolvePlugins(plugins, babelrcDir)
        };
        const { metadata } = await pify_1.default(core_1.transformFile)(file, babelOpts);
        const localeObj = localeMap(locales);
        const result = metadata['react-intl'].messages;
        for (const { id, defaultMessage, description } of result) {
            // eslint-disable-next-line no-unused-vars
            for (const locale of locales) {
                const message = defaultLocale === locale ? defaultMessage : '';
                localeObj[locale][id] = withDescriptions
                    ? { message, description }
                    : message;
            }
        }
        return localeObj;
    };
    const files = await pify_1.default(glob_1.default)(pattern);
    if (files.length === 0) {
        throw new Error(`File not found (${pattern})`);
    }
    const arr = await Promise.all(files.map(extractFromFile));
    return arr.reduce((h, obj) => lodash_merge_1.default(h, obj), localeMap(locales));
};
//# sourceMappingURL=index.js.map