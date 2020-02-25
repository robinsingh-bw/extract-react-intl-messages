declare type Options = {
    defaultLocale?: string;
    cwd?: string;
    withDescriptions?: boolean;
    [key: string]: unknown;
};
declare const _default: (locales: string[], pattern: string, { defaultLocale, withDescriptions, cwd, ...pluginOptions }?: Options) => Promise<Record<string, Record<string, {}>>>;
export default _default;
