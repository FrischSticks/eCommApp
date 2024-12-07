// LEARN MORE: https://blog.webdevsimplified.com/2024-01/next-js-app-router-cache/

// For Data Cache & Everything Next Js
import { unstable_cache as nextCache } from "next/cache";
// For Request Memoization
import { cache as reactCache } from "react";

// Takes any number of arguments with any params, will return Promise of any type (any function that takes & returns something)
type Callback = (...args: any[]) => Promise<any>

// Essentially emulates Next's built in Cache Function
export function cache<T extends Callback>(
    cb: T, 
    keyParts: string[],
    options: { revalidate?: number | false; tags?: string[] } = {}
) {
    // Callback is wrapped within reactCache & nextCache (First Cached as React, then as Next)
    return nextCache(reactCache(cb), keyParts, options)
}