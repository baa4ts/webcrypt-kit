# webcrypt-kit — `HASH()` y `Signature`

webcrypt-kit es un wrapper sobre la [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), pensado para simplificar su uso en entornos como Cloudflare Workers, donde no hay dependencias nativas de Node (como `crypto` o librerias como `bcrypt`) y solo se puede trabajar con las APIs estandar del runtime.

En vez de lidiar a mano con `TextEncoder`, `ArrayBuffer` y conversiones a hexadecimal cada vez que necesitas un hash o una firma, el kit expone funciones y clases simples y tipadas que hacen ese trabajo por vos.

## Instalacion

```bash
pnpm add webcrypt-kit
```

```bash
npm add webcrypt-kit
```

## HASH

```typescript
HASH(buffer: string, algorithm: HashAlgorithm): Promise<string>
```

| Parametro   | Tipo            | Descripcion                                            |
| ----------- | --------------- | ------------------------------------------------------ |
| `buffer`    | `string`        | Texto de entrada a hashear                             |
| `algorithm` | `HashAlgorithm` | `"SHA-1"` \| `"SHA-256"` \| `"SHA-384"` \| `"SHA-512"` |

**Retorna:** el hash en hexadecimal (`string`).

### Uso

```typescript
import { HASH } from 'webcrypt-kit';

const hash = await HASH('hola mundo', 'SHA-256');
console.log(hash);
```

## Signature

Clase para generar keys, firmar y verificar datos con distintos algoritmos de firma digital.

```typescript
new Signature(algorithm: SignatureAlgorithm)
```

| Algoritmo             | Tipo       | Key                                     |
| --------------------- | ---------- | ---------------------------------------- |
| `"HMAC"`              | Simetrico  | Una sola key (firma y verifica)          |
| `"ECDSA"`             | Asimetrico | Par de keys (privateKey / publicKey)     |
| `"RSASSA-PKCS1-v1_5"` | Asimetrico | Par de keys (privateKey / publicKey)     |
| `"RSA-PSS"`           | Asimetrico | Par de keys (privateKey / publicKey)     |

### Metodos

```typescript
key(): Promise<CryptoKey | CryptoKeyPair>
```
Genera la key (HMAC) o el par de keys (ECDSA/RSA) para el algoritmo configurado.

```typescript
sign(buffer: string, key: CryptoKey | CryptoKeyPair, hash?: HashAlgorithm, salt?: number): Promise<ArrayBuffer>
```
Firma un texto. Usa `privateKey` automaticamente si `key` es un par.

```typescript
verify(buffer: string, signature: BufferSource, key: CryptoKey | CryptoKeyPair, hash?: HashAlgorithm, salt?: number): Promise<boolean>
```
Verifica una firma contra el texto original. Usa `publicKey` automaticamente si `key` es un par.

| Parametro | Tipo            | Descripcion                                                             |
| --------- | --------------- | ------------------------------------------------------------------------ |
| `buffer`  | `string`        | Texto a firmar o verificar                                                |
| `key`     | `CryptoKey` \| `CryptoKeyPair` | Key generada con `key()`                                   |
| `hash`    | `HashAlgorithm` | Solo aplica si el algoritmo es `ECDSA`. Default: `"SHA-256"`             |
| `salt`    | `number`        | Solo aplica si el algoritmo es `RSA-PSS`. Default: `32`                  |

### Uso

```typescript
import { Signature } from 'webcrypt-kit';

const sig = new Signature('ECDSA');
const keyPair = await sig.key();

const firma = await sig.sign('hola mundo', keyPair);
const valida = await sig.verify('hola mundo', firma, keyPair);

console.log(valida); // true
```

## Link

[npmjs.com/package/webcrypt-kit](https://www.npmjs.com/package/webcrypt-kit)