import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(globalThis, { TextEncoder, TextDecoder });

if (!globalThis.structuredClone) {
  globalThis.structuredClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
}
