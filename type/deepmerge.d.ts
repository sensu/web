declare module 'deepmerge' {
  export interface Options {
    arrayMerge?(target: any[], source: any[], options?: Options): any[];
    clone?: boolean;
    customMerge?:
        (key: string,
         options?: Options) => ((x: any, y: any) => any) | undefined;
    isMergeableObject?(value: object): boolean;
  }

  const exports: {
    <T>(x: Partial<T>, y: Partial<T>, options?: deepmerge.Options): T;
    <T1, T2>(x: Partial<T1>, y: Partial<T2>, options?: deepmerge.Options):
        T1 & T2;
    all(objects: object[], options?: Options): object;
    all<T>(objects: Partial<T>[], options?: Options): T;
  };

  export default exports;
}
