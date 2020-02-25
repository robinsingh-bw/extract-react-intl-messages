declare type Opts = {
    defaultLocale: string;
    format?: string;
    flat?: boolean;
    [key: string]: unknown;
};
declare const extractMessage: {
    (locales: string[], pattern: string, buildDir: string, { format, flat, defaultLocale, ...opts }?: Opts): Promise<any[]>;
    extractReactIntl: (locales: string[], pattern: string, { defaultLocale, withDescriptions, cwd, ...pluginOptions }?: {
        [key: string]: unknown;
        defaultLocale?: string | undefined;
        cwd?: string | undefined;
        withDescriptions?: boolean | undefined;
    }) => Promise<Record<string, Record<string, {}>>>;
};
export default extractMessage;
