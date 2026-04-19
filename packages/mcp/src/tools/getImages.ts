import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AxiosInstance } from 'axios';

export const registerGetImagesTool = (server: McpServer, api: AxiosInstance) => {
    server.tool(
        'get_images',
        'Gets all images inside a specific folder.',
        {
            folderId: z.string().describe('ID of the folder to get images from')
        },
        async ({ folderId }) => {
            try {
                const res = await api.get(`/image/${folderId}`);

                if (res.data.length === 0) {
                    return {
                        content: [{
                            type: 'text',
                            text: 'No images found in this folder.'
                        }]
                    };
                }

                const imageList = res.data
                    .map((img: any) => {
                        const bytes = img.size;
                        let displaySize = '';
                        if (bytes < 1024) displaySize = `${bytes} B`;
                        else if (bytes < 1024 * 1024) displaySize = `${(bytes / 1024).toFixed(2)} KB`;
                        else displaySize = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

                        return `- ${img.name} (${displaySize})`;
                    })
                    .join('\n');

                return {
                    content: [{
                        type: 'text',
                        text: `Images:\n${imageList}`
                    }]
                };
            } catch (error: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to get images: ${error.response?.data?.message || error.message}`
                    }]
                };
            }
        }
    );
};
