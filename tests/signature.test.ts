import { expect, test } from '@rstest/core';
import { Signature } from '../src/index';

test('HMAC: firma y verifica correctamente', async () => {
  const sig = new Signature('HMAC');
  const key = await sig.key();

  const firma = await sig.sign('hello', key);
  const valida = await sig.verify('hello', firma, key);

  expect(valida).toBe(true);
});

test('HMAC: rechaza firma con texto modificado', async () => {
  const sig = new Signature('HMAC');
  const key = await sig.key();

  const firma = await sig.sign('hello', key);
  const valida = await sig.verify('bye', firma, key);

  expect(valida).toBe(false);
});

test('ECDSA: firma y verifica correctamente', async () => {
  const sig = new Signature('ECDSA');
  const keyPair = await sig.key();

  const firma = await sig.sign('hello', keyPair);
  const valida = await sig.verify('hello', firma, keyPair);

  expect(valida).toBe(true);
});

test('ECDSA: rechaza firma con texto modificado', async () => {
  const sig = new Signature('ECDSA');
  const keyPair = await sig.key();

  const firma = await sig.sign('hello', keyPair);
  const valida = await sig.verify('bye', firma, keyPair);

  expect(valida).toBe(false);
});

test('ECDSA: rechaza si el hash no coincide entre sign y verify', async () => {
  const sig = new Signature('ECDSA');
  const keyPair = await sig.key();

  const firma = await sig.sign('hello', keyPair, 'SHA-256');
  const valida = await sig.verify('hello', firma, keyPair, 'SHA-512');

  expect(valida).toBe(false);
});

test('RSASSA-PKCS1-v1_5: firma y verifica correctamente', async () => {
  const sig = new Signature('RSASSA-PKCS1-v1_5');
  const keyPair = await sig.key();

  const firma = await sig.sign('hello', keyPair);
  const valida = await sig.verify('hello', firma, keyPair);

  expect(valida).toBe(true);
});

test('RSASSA-PKCS1-v1_5: rechaza firma con texto modificado', async () => {
  const sig = new Signature('RSASSA-PKCS1-v1_5');
  const keyPair = await sig.key();

  const firma = await sig.sign('hello', keyPair);
  const valida = await sig.verify('bye', firma, keyPair);

  expect(valida).toBe(false);
});

test('RSA-PSS: firma y verifica correctamente', async () => {
  const sig = new Signature('RSA-PSS');
  const keyPair = await sig.key();

  const firma = await sig.sign('hello', keyPair);
  const valida = await sig.verify('hello', firma, keyPair);

  expect(valida).toBe(true);
});

test('RSA-PSS: rechaza firma con texto modificado', async () => {
  const sig = new Signature('RSA-PSS');
  const keyPair = await sig.key();

  const firma = await sig.sign('hello', keyPair);
  const valida = await sig.verify('bye', firma, keyPair);

  expect(valida).toBe(false);
});

test('key(): HMAC devuelve un CryptoKey, no un par', async () => {
  const sig = new Signature('HMAC');
  const key = await sig.key();

  expect(key instanceof CryptoKey).toBe(true);
});

test('key(): ECDSA devuelve un CryptoKeyPair', async () => {
  const sig = new Signature('ECDSA');
  const keyPair = await sig.key();

  expect('privateKey' in keyPair && 'publicKey' in keyPair).toBe(true);
});
