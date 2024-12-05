export async function isValidPassword(password: string, hashedPassword: string) {
    // Will Provide Given Password Hashed
    // console.log(await hashPassword(password))
    return (await hashPassword(password)) === hashedPassword
}

// Encrypts Password for Security
async function hashPassword(password: string) {
    const arrayBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password))

    // Convert to base 64, because this is a very long string
    return Buffer.from(arrayBuffer).toString("base64")
}