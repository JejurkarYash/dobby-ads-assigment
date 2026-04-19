import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AxiosInstance } from 'axios';

export const registerGetFolderSizeTool = (server: McpServer, api: AxiosInstance) => {
    server.tool(
        'get_folder_size',
        'Gets the total recursive size of a folder including all nested subfolders and images.',
        {
            folderId: z.string().describe('ID of the folder to get size of')
        },
        async ({ folderId }) => {
            try {
                const res = await api.get(`/folder/${folderId}/size`);

                const bytes = res.data.sizeInByte;
                let displaySize = '';

                if (bytes < 1024) displaySize = `${bytes} B`;
                else if (bytes < 1024 * 1024) displaySize = `${(bytes / 1024).toFixed(2)} KB`;
                else displaySize = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

                return {
                    content: [{
                        type: 'text',
                        text: `Folder size: ${displaySize}`
                    }]
                };
            } catch (error: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to get folder size: ${error.response?.data?.message || error.message}`
                    }]
                };
            }
        }
    );
};
