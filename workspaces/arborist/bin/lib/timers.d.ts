
declare global {
  namespace NodeJS {
    interface Process {
      emit(event: 'time', name: string, ...any: string[]): boolean;
      emit(event: 'timeEnd', name: string, ...any: string[]): boolean;
      on(event: 'time', listener: (name: string) => void): this;
      on(event: 'timeEnd', listener: (name: string) => void): this;
    }
  }
}

declare const finished: Map<string, number>;
export = finished;
