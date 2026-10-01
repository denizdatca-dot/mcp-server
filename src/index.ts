import { McpServer, createMcpHandler } from "@modelcontextprotocol/server";
import { z } from "zod";

function createServer() {
  const server = new McpServer({
    name: "grok-bot-mcp",
    version: "1.0.0",
  });

  server.registerTool(
    "send_message",
    {
      description: "Grok Bot'a mesaj gönderir.",
      inputSchema: z.object({
        mesaj: z.string().describe("Grok Bot'a gönderilecek mesaj"),
      }),
    },
    async ({ mesaj }) => {
      const url =
        "https://morning-art-1860.dj-dnz.workers.dev/?mesaj=" +
        encodeURIComponent(mesaj);

      const response = await fetch(url);
      const result = await response.text();

      if (!response.ok) {
        return {
          content: [
            {
              type: "text",
              text: `Mesaj gönderilemedi: ${response.status} ${result}`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Grok Bot'a gönderildi: ${mesaj}\n${result}`,
          },
        ],
      };
    },
  );

  return server;
}

export default createMcpHandler(createServer);
