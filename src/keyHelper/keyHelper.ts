export class keyHelper {
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
   * Exporta una key existente a bytes crudos, para poder guardarla.
   *
   * @param key Key generada con `key()` o `importKey()`.
   * @returns Los bytes de la key, como `ArrayBuffer`.
   */
  public async exportKey(key: CryptoKey): Promise<ArrayBuffer> {
    return await crypto.subtle.exportKey('raw', key);
  }

  /**
   * Importa una key ya existente (bytes guardados previamente con `exportKey()`).
   *
   * @param raw Bytes de la key, tal cual los devolvio `exportKey()`.
   * @returns `CryptoKey` lista para usar con `encrypt()`/`decrypt()`.
   */
  public async importKey(raw: BufferSource): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      'raw',
      raw,
      { name: this.algorithm },
      true,
      ['encrypt', 'decrypt'],
    );
  }
}
