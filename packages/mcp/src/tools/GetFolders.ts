import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AxiosInstance } from 'axios';

export const registerGetFoldersTool = (server: McpServer, api: AxiosInstance) => {
    server.tool(
        'get_folders',
        'Gets all folders. Leave parentId empty to get root folders. Pass parentId to get subfolders inside a folder.',
        {
            parentId: z.string().optional().describe('Parent folder ID. Leave empty to get root folders.')
        },
        async ({ parentId }) => {
            try {
                const endpoint = parentId
                    ? `/folder/${parentId}`
                    : '/folder/root';

                const res = await api.get(endpoint);

                const folders = res.data.folders || [];
                if (folders.length === 0) {
                    return {
                        content: [{
                            type: 'text',
                            text: 'No folders found.'
                        }]
                    };
                }

                const folderList = folders
                    .map((f: any) => `- ${f.name} (ID: ${f._id})`)
                    .join('\n');

                return {
                    content: [{
                        type: 'text',
                        text: `Folders:\n${folderList}`
                    }]
                };
            } catch (error: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to get folders: ${error.response?.data?.message || error.message}`
                    }]
                };
            }
        }
    );
};
