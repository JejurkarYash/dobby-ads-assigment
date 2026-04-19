import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import axios from 'axios';
import { config } from 'dotenv';
import { registerCreateFolderTool } from './tools/CreateFolder.js';
import { registerGetFoldersTool } from './tools/GetFolders.js';
import { registerGetFolderSizeTool } from './tools/GetFolderSize.js';
import { registerGetImagesTool } from './tools/getImages.js';

config();

const API_URL = process.env.API_URL;
const TOKEN = process.env.TOKEN;

const server = new McpServer({
    name: 'filenest-mcp',
    version: '1.0.0'
});

// @ts-ignore
const api = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`
    }
});

registerCreateFolderTool(server, api);
registerGetFoldersTool(server, api);
registerGetFolderSizeTool(server, api);
registerGetImagesTool(server, api);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('FileNest MCP server running...');