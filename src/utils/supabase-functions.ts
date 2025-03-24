/**
 * Type definitions for Supabase RPC functions
 * This helps with TypeScript type checking when calling stored procedures
 */

/**
 * Parameters for the get_user_profile_safe RPC function
 */
export interface GetUserProfileSafeParams {
  user_id_param: string;
}

/**
 * Map of all RPC function names to their parameter types
 * This provides type safety when calling RPC functions
 */
export interface RPCFunctionParams {
  get_user_profile_safe: GetUserProfileSafeParams;
  // Add other RPC functions here as needed
}

/**
 * Type-safe wrapper for Supabase RPC calls
 * 
 * @param supabase The Supabase client instance
 * @param functionName Name of the RPC function to call
 * @param params Parameters to pass to the function
 * @returns Promise with the RPC result
 */
export function callRPC<T extends keyof RPCFunctionParams>(
  supabase: any,
  functionName: T,
  params: RPCFunctionParams[T]
) {
  return supabase.rpc(functionName, params);
}
