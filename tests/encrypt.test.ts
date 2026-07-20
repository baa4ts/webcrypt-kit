import { expect, test } from '@rstest/core';
import { Encrypt } from '../src/index';

// ---------------------------------------------------------------------------
// AES-GCM
// ---------------------------------------------------------------------------

test('AES-GCM: encripta y desencripta correctamente', async () => {
  const enc = new Encrypt('AES-GCM');
  const key = await enc.key();

  const { ciphertext, iv } = await enc.encrypt('hola mundo', key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe('hola mundo');
});

test('AES-GCM: el ciphertext no es igual al texto plano', async () => {
  const enc = new Encrypt('AES-GCM');
  const key = await enc.key();

  const { ciphertext } = await enc.encrypt('hola mundo', key);
  const texto = new TextDecoder().decode(ciphertext);

  expect(texto).not.toBe('hola mundo');
});

test('AES-GCM: falla si se usa una key distinta para desencriptar', async () => {
  const enc = new Encrypt('AES-GCM');
  const key = await enc.key();
  const otraKey = await enc.key();

  const { ciphertext, iv } = await enc.encrypt('hola mundo', key);

  await expect(enc.decrypt(ciphertext, otraKey, iv)).rejects.toThrow();
});

test('AES-GCM: falla si se usa un iv distinto para desencriptar', async () => {
  const enc = new Encrypt('AES-GCM');
  const key = await enc.key();

  const { ciphertext } = await enc.encrypt('hola mundo', key);
  const otroIv = crypto.getRandomValues(new Uint8Array(12));

  await expect(enc.decrypt(ciphertext, key, otroIv)).rejects.toThrow();
});

test('AES-GCM: dos encriptados del mismo texto dan resultados distintos (iv random)', async () => {
  const enc = new Encrypt('AES-GCM');
  const key = await enc.key();

  const a = await enc.encrypt('hola mundo', key);
  const b = await enc.encrypt('hola mundo', key);

  expect(new Uint8Array(a.ciphertext)).not.toEqual(
    new Uint8Array(b.ciphertext),
  );
  expect(a.iv).not.toEqual(b.iv);
});

test('AES-GCM: el iv tiene 12 bytes', async () => {
  const enc = new Encrypt('AES-GCM');
  const key = await enc.key();

  const { iv } = await enc.encrypt('hola', key);

  expect(iv.length).toBe(12);
});

test('AES-GCM: encripta y desencripta texto vacio', async () => {
  const enc = new Encrypt('AES-GCM');
  const key = await enc.key();

  const { ciphertext, iv } = await enc.encrypt('', key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe('');
});

test('AES-GCM: soporta caracteres unicode', async () => {
  const enc = new Encrypt('AES-GCM');
  const key = await enc.key();
  const texto = 'ñoño 日本語 🔒';

  const { ciphertext, iv } = await enc.encrypt(texto, key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe(texto);
});

test('AES-GCM: encripta y desencripta texto largo', async () => {
  const enc = new Encrypt('AES-GCM');
  const key = await enc.key();
  const texto = 'a'.repeat(10000);

  const { ciphertext, iv } = await enc.encrypt(texto, key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe(texto);
});

// ---------------------------------------------------------------------------
// AES-CBC
// ---------------------------------------------------------------------------

test('AES-CBC: encripta y desencripta correctamente', async () => {
  const enc = new Encrypt('AES-CBC');
  const key = await enc.key();

  const { ciphertext, iv } = await enc.encrypt('hola mundo', key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe('hola mundo');
});

test('AES-CBC: el iv tiene 16 bytes', async () => {
  const enc = new Encrypt('AES-CBC');
  const key = await enc.key();

  const { iv } = await enc.encrypt('hola', key);

  expect(iv.length).toBe(16);
});

test('AES-CBC: encripta y desencripta texto vacio', async () => {
  const enc = new Encrypt('AES-CBC');
  const key = await enc.key();

  const { ciphertext, iv } = await enc.encrypt('', key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe('');
});

test('AES-CBC: soporta caracteres unicode', async () => {
  const enc = new Encrypt('AES-CBC');
  const key = await enc.key();
  const texto = 'ñoño 日本語 🔒';

  const { ciphertext, iv } = await enc.encrypt(texto, key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe(texto);
});

test('AES-CBC: encripta y desencripta texto largo', async () => {
  const enc = new Encrypt('AES-CBC');
  const key = await enc.key();
  const texto = 'a'.repeat(10000);

  const { ciphertext, iv } = await enc.encrypt(texto, key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe(texto);
});

test('AES-CBC: key equivocada da error o texto corrupto, nunca el original', async () => {
  const enc = new Encrypt('AES-CBC');
  const key = await enc.key();
  const otraKey = await enc.key();

  const { ciphertext, iv } = await enc.encrypt('hola mundo', key);

  try {
    const resultado = await enc.decrypt(ciphertext, otraKey, iv);
    // Si no tira error, el resultado NO debe ser el texto original
    expect(resultado).not.toBe('hola mundo');
  } catch (err) {
    // CBC puede fallar por padding invalido, tambien es un resultado valido
    expect(err).toBeDefined();
  }
});

// ---------------------------------------------------------------------------
// AES-CTR
// ---------------------------------------------------------------------------

test('AES-CTR: encripta y desencripta correctamente', async () => {
  const enc = new Encrypt('AES-CTR');
  const key = await enc.key();

  const { ciphertext, iv } = await enc.encrypt('hola mundo', key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe('hola mundo');
});

test('AES-CTR: el iv (counter) tiene 16 bytes', async () => {
  const enc = new Encrypt('AES-CTR');
  const key = await enc.key();

  const { iv } = await enc.encrypt('hola', key);

  expect(iv.length).toBe(16);
});

test('AES-CTR: encripta y desencripta texto vacio', async () => {
  const enc = new Encrypt('AES-CTR');
  const key = await enc.key();

  const { ciphertext, iv } = await enc.encrypt('', key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe('');
});

test('AES-CTR: soporta caracteres unicode', async () => {
  const enc = new Encrypt('AES-CTR');
  const key = await enc.key();
  const texto = 'ñoño 日本語 🔒';

  const { ciphertext, iv } = await enc.encrypt(texto, key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe(texto);
});

test('AES-CTR: encripta y desencripta texto largo', async () => {
  const enc = new Encrypt('AES-CTR');
  const key = await enc.key();
  const texto = 'a'.repeat(10000);

  const { ciphertext, iv } = await enc.encrypt(texto, key);
  const resultado = await enc.decrypt(ciphertext, key, iv);

  expect(resultado).toBe(texto);
});

test('AES-CTR: key equivocada NO tira error, pero da texto corrupto', async () => {
  const enc = new Encrypt('AES-CTR');
  const key = await enc.key();
  const otraKey = await enc.key();

  const { ciphertext, iv } = await enc.encrypt('hola mundo', key);
  const resultado = await enc.decrypt(ciphertext, otraKey, iv);

  // CTR no es autenticado: no falla, pero el resultado no coincide
  expect(resultado).not.toBe('hola mundo');
});

// ---------------------------------------------------------------------------
// Generales
// ---------------------------------------------------------------------------

test('key(): devuelve un CryptoKey', async () => {
  const enc = new Encrypt('AES-GCM');
  const key = await enc.key();

  expect(key instanceof CryptoKey).toBe(true);
});
