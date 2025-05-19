/**
 * Configuration for an LLM provider
 */
export interface LLMProviderConfig {
    apiKey: string;
    model: string;
    provider: 'openai' | 'gemini' | 'claude';
}
/**
 * User configuration
 */
export interface UserConfig {
    name?: string;
    email?: string;
}
/**
 * Main application configuration
 */
export interface AppConfig {
    llmProvider: LLMProviderConfig;
    user?: UserConfig;
}
/**
 * Custom error for configuration issues
 */
export declare class ConfigError extends Error {
    constructor(message: string);
}
/**
 * Loads the application configuration from ~/.nms/config.json
 * @returns The typed configuration object
 * @throws {ConfigError} If the file is not found, is not valid JSON, or fails validation
 */
export declare function loadAppConfig(): Promise<AppConfig>;
