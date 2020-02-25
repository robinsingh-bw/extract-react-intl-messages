export default function _default({ types: t }: {
    types: any;
}): {
    pre(file: any): void;
    post(file: any): void;
    visitor: {
        CallExpression(path: any, state: any): void;
    };
};
