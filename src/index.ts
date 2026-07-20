
/**
 * @param buffer Texto para generar el hash.
 * @param algorithm Algoritmo de hash (SHA-1/SHA-256/SHA-384/SHA-512).
 * @returns Hash generado en hexadecimal.
 */
export const HASH = async (buffer: string, algorithm: HashAlgorithm) => {
    const b = new TextEncoder().encode(buffer)

    const hashBuffer = await crypto.subtle.digest(algorithm, b);

    return [...new Uint8Array(hashBuffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}


type HashAlgorithm =
    "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"