import OpenAI from "openai";

export const getModelToken = (): { model: string; token: string } => {
  if (process.env.OPENAI_API_KEY) {
    return {
      model: "openai",
      token: process.env.OPENAI_API_KEY,
    };
  }

  throw new Error("No model token found");
};

export const getBrowserlessConfig = (): { baseurl: string; token?: string } => {
  if (process.env.BROWSERLESS_BASE_URL) {
    return {
      baseurl: process.env.BROWSERLESS_BASE_URL,
      token: process.env.BROWSERLESS_TOKEN,
    };
  }

  throw new Error("No Browserless base URL found");
};

export const getFinchartURL = () => {
  if (process.env.FINCHARTS_BASE_URL) {
    return process.env.FINCHARTS_BASE_URL;
  }

  throw new Error("No Fincharts base URL found");
};

export const getFinchartImage = async ({
  symbol,
  interval,
  studies,
}: {
  symbol: string;
  interval: string;
  studies?: string;
}): Promise<string | null> => {
  const { baseurl, token } = getBrowserlessConfig();
  const finchartUrl = getFinchartURL();

  const url = `${baseurl}/screenshot?token=${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `${finchartUrl}/?symbol=${symbol}&interval=${interval}&studies=${studies}`,
      options: {
        fullPage: true,
        type: "jpeg",
      },
      viewport: {
        width: 1024,
        height: 1366,
      },
      gotoOptions: { waitUntil: "networkidle0" },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.toString("base64");
};

const instructions = `
You are a financial analyst. Analyze the image and provide a technical analysis.
The response will be a json with this format:
{
  "success": true or false,
  "symbol": "indicate the symbol",
  "interval": "indicate the interval",
  "studies": "indicate the studies",
  "analysis": "indicate the analysis",
  "recommendation": "indicate the recommendation",
  "action": "indicate the action  (buy, sell, hold)",
  "price": "indicate the price",
  "support": "indicate the support",
  "resistance": "indicate the resistance"
}
If you can't analyze the image, return { success: false, message: "<error message>, try again" }.
`;

export const getOpenAIAnalysis = async (base64Image: string) => {
  const openai = new OpenAI();
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions,
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: "what's in this image?" },
          {
            type: "input_image",
            image_url: `data:image/jpeg;base64,${base64Image}`,
            detail: "auto",
          },
        ],
      },
    ],
  });
  return response.output_text;
};

export const INTERVALS = ["1", "5", "15", "30", "60", "120", "240", "D", "W"] as const;
export const STUDIES = [
  "accd",
  "studyadr",
  "aroon",
  "atr",
  "awesomeoscillator",
  "bb",
  "bollingerbandsr",
  "bollingerbandswidth",
  "cmf",
  "chaikinoscillator",
  "chandemo",
  "choppinessindex",
  "cci",
  "crsi",
  "correlationcoefficient",
  "detrendedpriceoscillator",
  "dm",
  "donch",
  "doubleema",
  "easeofmovement",
  "efi",
  "env",
  "fishertransform",
  "hv",
  "hullma",
  "ichimokucloud",
  "kltnr",
  "kst",
  "linearregression",
  "macd",
  "mom",
  "mf",
  "moonphases",
  "masimple",
  "maexp",
  "maweighted",
  "obv",
  "psar",
  "pivotpointshighlow",
  "pivotpointsstandard",
  "priceosc",
  "pricevolumetrend",
  "roc",
  "rsi",
  "vigorindex",
  "volatilityindex",
  "smiergodicindicator",
  "smiergodicoscillator",
  "stochastic",
  "stochasticrsi",
  "tripleema",
  "trix",
  "ultimateosc",
  "vstop",
  "volume",
  "vwap",
  "mavolumeweighted",
  "williamr",
  "williamsalligator",
  "williamsfractal",
  "zigzag",
] as const;