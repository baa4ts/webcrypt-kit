/**
 * Utilidad para generar keys, firmar y verificar datos con
 * HMAC, ECDSA, RSASSA-PKCS1-v1_5 o RSA-PSS.
 */
export class Signature {
  /**
   * @param algorithm Algoritmo de firma a usar en esta instancia.
   */
  constructor(public algorithm: SignatureAlgorithm) {
    this.algorithm = algorithm;
  }

  /**
   * Genera una key (o par de keys) para el algoritmo configurado.
   *
   * @returns `CryptoKey` si es HMAC, o `CryptoKeyPair` (privateKey/publicKey) si es ECDSA/RSA.
   */
  public async key(): Promise<CryptoKey | CryptoKeyPair> {
    if (this.algorithm === 'HMAC') {
      return await crypto.subtle.generateKey(
        { name: 'HMAC', hash: 'SHA-256' },
        true,
        ['sign', 'verify'],
      );
    }

    if (this.algorithm === 'ECDSA') {
      return await crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve: 'P-256' },
        true,
        ['sign', 'verify'],
      );
    }

    if (this.algorithm === 'RSASSA-PKCS1-v1_5') {
      return await crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify'],
      );
    }

    if (this.algorithm === 'RSA-PSS') {
      return await crypto.subtle.generateKey(
        {
          name: 'RSA-PSS',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify'],
      );
    }

    throw new Error(`Algoritmo no soportado: ${this.algorithm}`);
  }

  /**
   * Firma un texto con la key indicada.
   *
   * @param buffer Texto a firmar.
   * @param key Key generada con `key()`. Si es un par, usa `privateKey` automáticamente.
   * @param hash Algoritmo de hash. Solo aplica si `algorithm` es ECDSA (ignorado en el resto).
   * @param salt Largo del salt en bytes. Solo aplica si `algorithm` es RSA-PSS (ignorado en el resto).
   * @returns Firma generada, como `ArrayBuffer`.
   */
  public async sign(
    buffer: string,
    key: CryptoKey | CryptoKeyPair,
    hash: HashAlgorithm = 'SHA-256',
    salt: number = 32,
  ) {
    const tmp = new TextEncoder().encode(buffer);

    return await crypto.subtle.sign(
      {
        name: this.algorithm,
        ...(this.algorithm === 'ECDSA' && { hash: hash }),
        ...(this.algorithm === 'RSA-PSS' && { saltLength: salt }),
      },
      key instanceof CryptoKey ? key : key.privateKey,
      tmp,
    );
  }

  /**
   * Verifica que una firma corresponda al texto original.
   *
   * @param buffer Texto original (el mismo que se firmó).
   * @param signature Firma obtenida con `sign()`.
   * @param key Key generada con `key()`. Si es un par, usa `publicKey` automáticamente.
   * @param hash Algoritmo de hash. Debe ser el mismo usado en `sign()` (solo aplica a ECDSA).
   * @param salt Largo del salt en bytes. Debe ser el mismo usado en `sign()` (solo aplica a RSA-PSS).
   * @returns `true` si la firma es válida, `false` si no.
   */
  public async verify(
    buffer: string,
    signature: BufferSource,
    key: CryptoKey | CryptoKeyPair,
    hash: HashAlgorithm = 'SHA-256',
    salt: number = 32,
  ) {
    const data = new TextEncoder().encode(buffer);
    const verifyKey = key instanceof CryptoKey ? key : key.publicKey;

    return await crypto.subtle.verify(
      {
        name: this.algorithm,
        ...(this.algorithm === 'ECDSA' && { hash }),
        ...(this.algorithm === 'RSA-PSS' && { saltLength: salt }),
      },
      verifyKey,
      signature,
      data,
    );
  }
}
