// Will be removed
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getFinchartImage, getModelToken, getOpenAIAnalysis, INTERVALS, STUDIES } from "./helpers/index.js";
const server = new McpServer({
    name: "technical-analysis",
    version: "1.0.0",
});
server.tool("get_technical_analysis", "Get technical analysis from tradingview", {
    symbol: z.string().describe("The symbol to analyze, e.g. 'BINANCE:BTCUSDT', 'NASDAQ:MSFT', EURUSD, AAPL"),
    interval: z.enum(INTERVALS).describe("The interval to analyze, e.g. '15'"),
    studies: z.array(z.enum(STUDIES).describe("The studies to analyze, e.g. 'BB,macd,stochasticrsi,volume'")).optional()
}, async ({ symbol, interval, studies }) => {
    const { model } = getModelToken();
    const image = await getFinchartImage({
        symbol,
        interval,
        studies: studies?.join(",") || "",
    });
    if (!image) {
        throw new Error("Failed to get image");
    }
    let analysis = "";
    if (model === "openai") {
        analysis = await getOpenAIAnalysis(image);
    }
    return {
        content: [
            {
                type: "text",
                text: analysis
            }
        ]
    };
});
// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
