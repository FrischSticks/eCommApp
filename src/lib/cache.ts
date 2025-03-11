// LEARN MORE: https://blog.webdevsimplified.com/2024-01/next-js-app-router-cache/

// For Data Cache & Everything Next Js
import { unstable_cache as nextCache } from "next/cache";
// For Request Memoization
import { cache as reactCache } from "react";

// Define a generic type for the callback function
type Callback<TArgs extends any[], TResult> = (...args: TArgs) => Promise<TResult>;

// Essentially emulates Next's built in Cache Function
export function cache<TArgs extends any[], TResult>(
    cb: Callback<TArgs, TResult>, 
    keyParts: string[],
    options: { revalidate?: number | false; tags?: string[] } = {}
) {
    // Callback is wrapped within reactCache & nextCache (First Cached as React, then as Next)
    return nextCache(reactCache(cb), keyParts, options)
}