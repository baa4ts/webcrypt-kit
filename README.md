# webcrypt-kit

webcrypt-kit es un wrapper sobre la [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), pensado para simplificar su uso en entornos como Cloudflare Workers, donde no hay dependencias nativas de Node (como `crypto` o librerias como `bcrypt`) y solo se puede trabajar con las APIs estandar del runtime.

En vez de lidiar a mano con `TextEncoder`, `ArrayBuffer` y conversiones a hexadecimal cada vez que necesitas un hash o una firma, el kit expone funciones y clases simples y tipadas que hacen ese trabajo por vos.

### Status

| Section           |        Status         |
| :---------------- | :-------------------: |
| Signing           |      ✅ Complete      |
| Encrypt           |      ✅ Complete      |
| HASH              |      ✅ Complete      |
| Key export/import | ✅ Complete (Encrypt) |

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

### Exportar e importar la key

Una key generada con `key()` solo vive en memoria mientras corre el proceso. Para guardarla (DB, variable de entorno, etc) y reusarla despues, hay que exportarla a bytes y despues importarla de vuelta.

```typescript
import { Encrypt } from 'webcrypt-kit';

const enc = new Encrypt('AES-GCM');

// Generar y exportar (una sola vez, al hacer el setup)
const key = await enc.key();
const raw = await enc.exportKey(key);
const keyBase64 = Buffer.from(raw).toString('base64');
// guardar keyBase64 en .env, por ejemplo

// Importar de vuelta (en cada proceso/request que necesite la key)
const rawRecuperada = Buffer.from(keyBase64, 'base64');
const keyRecuperada = await enc.importKey(rawRecuperada);

// Usar la key importada normalmente
const { ciphertext, iv } = await enc.encrypt('mi texto secreto', keyRecuperada);
const textoOriginal = await enc.decrypt(ciphertext, keyRecuperada, iv);
```

| Metodo           | Descripcion                                                                   |
| ---------------- | ----------------------------------------------------------------------------- |
| `exportKey(key)` | Convierte un `CryptoKey` a bytes (`ArrayBuffer`) crudos, listos para guardar. |
| `importKey(raw)` | Convierte bytes guardados de vuelta a un `CryptoKey` usable.                  |

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

> **Nota:** exportar/importar keys de `Signature` (privada/publica) todavia no esta implementado en esta version.

---

**Link:** [npmjs.com/package/webcrypt-kit](https://www.npmjs.com/package/webcrypt-kit)
