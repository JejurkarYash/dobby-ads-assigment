import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AxiosInstance } from 'axios';

export const registerCreateFolderTool = (server: McpServer, api: AxiosInstance) => {
    server.tool(
        'create_folder',
        'Creates a new folder. Leave parentId empty to create at root level.',
        {
            name: z.string().describe('Name of the folder to create'),
            parentId: z.string().optional().describe('ID of the parent folder. Leave empty for root.')
        },
        async ({ name, parentId }) => {
            try {
                const res = await api.post('/folder/create', {
                    name,
                    parentId: parentId || null
                });

                return {
                    content: [{
                        type: 'text',
                        text: `Folder "${name}" created successfully! Folder ID: ${res.data.folder._id}`
                    }]
                };
            } catch (error: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to create folder: ${error.response?.data?.message || error.message}`
                    }]
                };
            }
        }
    );
};
