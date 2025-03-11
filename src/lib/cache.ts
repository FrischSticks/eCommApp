import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

// Define a strongly typed generic callback function
type Callback<TArgs extends unknown[], TResult> = (...args: TArgs) => Promise<TResult>;

export function cache<TArgs extends unknown[], TResult>(
    cb: Callback<TArgs, TResult>, 
    keyParts: string[],
    options: { revalidate?: number | false; tags?: string[] } = {}
) {
    return nextCache(reactCache(cb), keyParts, options);
}