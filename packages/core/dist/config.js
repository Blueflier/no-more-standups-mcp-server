import fs from 'fs/promises';
import path from 'path';
import os from 'os';
/**
 * Custom error for configuration issues
 */
export class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}
/**
 * Loads the application configuration from ~/.nms/config.json
 * @returns The typed configuration object
 * @throws {ConfigError} If the file is not found, is not valid JSON, or fails validation
 */
export async function loadAppConfig() {
    try {
        // Determine user's home directory path
        const homeDir = os.homedir();
        const configPath = path.join(homeDir, '.nms', 'config.json');
        // Read the file content
        const fileContent = await fs.readFile(configPath, 'utf-8');
        // Parse the JSON content
        let config;
        try {
            config = JSON.parse(fileContent);
        }
        catch {
            throw new ConfigError('Failed to parse config file: Invalid JSON format');
        }
        // Validate the parsed object
        if (!config || typeof config !== 'object') {
            throw new ConfigError('Invalid config: Expected an object');
        }
        const typedConfig = config;
        // Validate llmProvider field
        if (!typedConfig.llmProvider || typeof typedConfig.llmProvider !== 'object') {
            throw new ConfigError('Invalid config: Missing or invalid llmProvider field');
        }
        const llmProvider = typedConfig.llmProvider;
        // Validate required fields in llmProvider
        if (typeof llmProvider.apiKey !== 'string') {
            throw new ConfigError('Invalid config: Missing or invalid apiKey in llmProvider');
        }
        if (typeof llmProvider.model !== 'string') {
            throw new ConfigError('Invalid config: Missing or invalid model in llmProvider');
        }
        if (typeof llmProvider.provider !== 'string' ||
            !['openai', 'gemini', 'claude'].includes(llmProvider.provider)) {
            throw new ConfigError('Invalid config: provider must be one of "openai", "gemini", or "claude"');
        }
        // Validate user field if present
        let user;
        if (typedConfig.user) {
            if (typeof typedConfig.user !== 'object') {
                throw new ConfigError('Invalid config: user field must be an object');
            }
            const userObj = typedConfig.user;
            if (userObj.name !== undefined && typeof userObj.name !== 'string') {
                throw new ConfigError('Invalid config: user.name must be a string');
            }
            if (userObj.email !== undefined && typeof userObj.email !== 'string') {
                throw new ConfigError('Invalid config: user.email must be a string');
            }
            user = {
                name: userObj.name,
                email: userObj.email,
            };
        }
        // Return the typed configuration object
        return {
            llmProvider: {
                apiKey: llmProvider.apiKey,
                model: llmProvider.model,
                provider: llmProvider.provider,
            },
            user,
        };
    }
    catch (error) {
        if (error instanceof ConfigError) {
            throw error;
        }
        if (error.code === 'ENOENT') {
            throw new ConfigError('Config file not found: ~/.nms/config.json');
        }
        throw new ConfigError(`Failed to load config: ${error.message}`);
    }
}
