export declare const empty: IDisposable;
export interface IDisposable {
    dispose(): void;
}
export declare function dispose<T extends IDisposable>(...disposables: T[]): T;
export declare function dispose<T extends IDisposable>(disposables: T[]): T[];
export declare function combinedDisposable(disposables: IDisposable[]): IDisposable;
export declare function combinedDisposable(...disposables: IDisposable[]): IDisposable;
export declare function toDisposable(...fns: (() => void)[]): IDisposable;
export declare abstract class Disposable implements IDisposable {
    private _toDispose;
    constructor();
    dispose(): void;
    protected _register<T extends IDisposable>(t: T): T;
}
export declare class Disposables extends Disposable {
    add<T extends IDisposable>(e: T): T;
    add(...elements: IDisposable[]): void;
}
