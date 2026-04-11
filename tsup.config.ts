import { defineConfig } from 'tsup';

export default defineConfig({
  clean: false,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  target: 'node18',
  treeshake: true,
});
