/**
 * Utilidad para generar keys, encriptar y desencriptar datos usando
 * los distintos modos de AES soportados por SubtleCrypto.
 */
export class Encrypt {
  /**
   * @param algorithm Algoritmo de encriptado a usar en esta instancia.
   */
  constructor(public algorithm: EncryptAlgorithm) {
    this.algorithm = algorithm;
  }

  /**
   * Genera una key simetrica para el algoritmo configurado.
   *
   * @returns `CryptoKey` lista para encriptar y desencriptar.
   */
  public async key(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      { name: this.algorithm, length: 256 },
      true,
      ['encrypt', 'decrypt'],
    );
  }

  /**
   * Encripta un texto con la key indicada.
   *
   * @param buffer Texto a encriptar.
   * @param key Key generada con `key()`.
   * @returns Objeto con el `ciphertext` y el `iv` usado (necesario para desencriptar despues).
   */
  public async encrypt(buffer: string, key: CryptoKey) {
    const data = new TextEncoder().encode(buffer);

    // AES-CTR usa "counter" en vez de "iv", pero funciona igual como nonce
    const iv = crypto.getRandomValues(
      new Uint8Array(this.algorithm === 'AES-GCM' ? 12 : 16),
    );

    const params =
      this.algorithm === 'AES-CTR'
        ? { name: this.algorithm, counter: iv, length: 64 }
        : { name: this.algorithm, iv };

    const ciphertext = await crypto.subtle.encrypt(params, key, data);

    return { ciphertext, iv };
  }

  /**
   * Desencripta un ciphertext con la key y el iv usados al encriptar.
   *
   * @param ciphertext Dato encriptado, obtenido de `encrypt()`.
   * @param key Misma key usada en `encrypt()`.
   * @param iv Mismo iv devuelto por `encrypt()`.
   * @returns El texto original desencriptado.
   */
  public async decrypt(
    ciphertext: BufferSource,
    key: CryptoKey,
    iv: Uint8Array,
  ) {
    const params =
      this.algorithm === 'AES-CTR'
        ? { name: this.algorithm, counter: iv, length: 64 }
        : { name: this.algorithm, iv };

    const decrypted = await crypto.subtle.decrypt(params, key, ciphertext);

    return new TextDecoder().decode(decrypted);
  }
}
