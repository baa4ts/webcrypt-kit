import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['webworker', 'es2022'],
      dts: true,
    },
    {
      format: 'cjs',
      syntax: ['node', 'es2022'],
    },
  ],
});
