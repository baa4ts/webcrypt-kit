# webcrypt-kit — `HASH()`

webcrypt-kit es un wrapper sobre la [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), pensado para simplificar su uso en entornos como Cloudflare Workers, donde no hay dependencias nativas de Node (como `crypto` o librerias como `bcrypt`) y solo se puede trabajar con las APIs estandar del runtime.
 
En vez de lidiar a mano con `TextEncoder`, `ArrayBuffer` y conversiones a hexadecimal cada vez que necesitas un hash, el kit expone funciones simples y tipadas que hacen ese trabajo por vos.

## Instalacion

```bash
pnpm add webcrypt-kit
```

```bash
npm add webcrypt-kit
```

## Firma

```typescript
HASH(buffer: string, algorithm: HashAlgorithm): Promise<string>
```

| Parametro   | Tipo             | Descripcion                                    |
|-------------|------------------|-------------------------------------------------|
| `buffer`    | `string`         | Texto de entrada a hashear                      |
| `algorithm` | `HashAlgorithm`  | `"SHA-1"` \| `"SHA-256"` \| `"SHA-384"` \| `"SHA-512"` |

**Retorna:** el hash en hexadecimal (`string`).

## Uso

```typescript
import { HASH } from "webcrypt-kit";

const hash = await HASH("hola mundo", "SHA-256");
console.log(hash);
```

## Link

[npmjs.com/package/webcrypt-kit](https://www.npmjs.com/package/webcrypt-kit)