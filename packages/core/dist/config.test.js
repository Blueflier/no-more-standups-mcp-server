import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { loadAppConfig, ConfigError } from './config.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
// Mock modules
vi.mock('fs/promises');
vi.mock('os');
describe('loadAppConfig', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(os.homedir).mockReturnValue('/mock/home');
    });
    afterEach(() => {
        vi.clearAllMocks();
    });
    test('loads valid config file', async () => {
        // Arrange
        const mockConfig = {
            llmProvider: {
                apiKey: 'test-api-key',
                model: 'gpt-4',
                provider: 'openai',
            },
            user: {
                name: 'Test User',
                email: 'test@example.com',
            },
        };
        vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockConfig));
        // Act
        const result = await loadAppConfig();
        // Assert
        expect(fs.readFile).toHaveBeenCalledWith(path.join('/mock/home', '.nms', 'config.json'), 'utf-8');
        expect(result).toEqual(mockConfig);
    });
    test('throws ConfigError when file not found', async () => {
        // Arrange
        const error = new Error('File not found');
        error.code = 'ENOENT';
        vi.mocked(fs.readFile).mockRejectedValue(error);
        // Act & Assert
        await expect(loadAppConfig()).rejects.toThrow(ConfigError);
        await expect(loadAppConfig()).rejects.toThrow('Config file not found: ~/.nms/config.json');
    });
    test('throws ConfigError when file contains invalid JSON', async () => {
        // Arrange
        vi.mocked(fs.readFile).mockResolvedValue('{ invalid json }');
        // Act & Assert
        await expect(loadAppConfig()).rejects.toThrow(ConfigError);
        await expect(loadAppConfig()).rejects.toThrow('Failed to parse config file: Invalid JSON format');
    });
    test('throws ConfigError when config is missing required fields', async () => {
        // Arrange
        const invalidConfig = {
        // Missing llmProvider field
        };
        vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(invalidConfig));
        // Act & Assert
        await expect(loadAppConfig()).rejects.toThrow(ConfigError);
        await expect(loadAppConfig()).rejects.toThrow('Invalid config: Missing or invalid llmProvider field');
    });
    test('throws ConfigError when llmProvider has invalid provider value', async () => {
        // Arrange
        const invalidConfig = {
            llmProvider: {
                apiKey: 'test-api-key',
                model: 'gpt-4',
                provider: 'invalid-provider', // Invalid provider
            },
        };
        vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(invalidConfig));
        // Act & Assert
        await expect(loadAppConfig()).rejects.toThrow(ConfigError);
        await expect(loadAppConfig()).rejects.toThrow('Invalid config: provider must be one of "openai", "gemini", or "claude"');
    });
});
