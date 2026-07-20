# webcrypt-kit

webcrypt-kit es un wrapper sobre la [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), pensado para simplificar su uso en entornos como Cloudflare Workers, donde no hay dependencias nativas de Node (como `crypto` o librerias como `bcrypt`) y solo se puede trabajar con las APIs estandar del runtime.

En vez de lidiar a mano con `TextEncoder`, `ArrayBuffer` y conversiones a hexadecimal cada vez que necesitas un hash o una firma, el kit expone funciones y clases simples y tipadas que hacen ese trabajo por vos.

### Status

| Section |        Status        |
| :------ | :------------------: |
| Signing |     ✅ Complete      |
| Encrypt | ⏳ In Progress (50%) |
| HASH    |     ✅ Complete      |

## Instalacion

```bash
pnpm add webcrypt-kit
```

---

## HASH()

Hashea un texto y devuelve el resultado directamente en hexadecimal.

**Algoritmos soportados:** `SHA-1` | `SHA-256` | `SHA-384` | `SHA-512`

```typescript
import { HASH } from 'webcrypt-kit';

const hash = await HASH('hola mundo', 'SHA-256');
console.log(hash);
```

---

## Encrypt

Clase para encriptar y desencriptar datos usando los modos de AES (`AES-GCM`, `AES-CBC`, `AES-CTR`). Se encarga de manejar el vector de inicializacion (IV) por vos.

```typescript
import { Encrypt } from 'webcrypt-kit';

const enc = new Encrypt('AES-GCM');

// 1. Generar la key simetrica
const key = await enc.key();

// 2. Encriptar (guarda tanto el ciphertext como el iv)
const { ciphertext, iv } = await enc.encrypt('mi texto secreto', key);

// 3. Desencriptar
const textoOriginal = await enc.decrypt(ciphertext, key, iv);

console.log(textoOriginal); // "mi texto secreto"
```

---

## Signature

Clase para generar keys, firmar y verificar datos. Soporta algoritmos simetricos (`HMAC`) y asimetricos (`ECDSA`, `RSASSA-PKCS1-v1_5`, `RSA-PSS`). Extrae la clave privada o publica automaticamente si usas algoritmos asimetricos.

```typescript
import { Signature } from 'webcrypt-kit';

const sig = new Signature('ECDSA');

// 1. Generar el par de keys
const keyPair = await sig.key();

// 2. Firmar el texto
const firma = await sig.sign('hola mundo', keyPair);

// 3. Verificar la firma
const esValida = await sig.verify('hola mundo', firma, keyPair);

console.log(esValida); // true
```

---

**Link:** [npmjs.com/package/webcrypt-kit](https://www.npmjs.com/package/webcrypt-kit)
