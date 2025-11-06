import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing API key. Set VITE_GEMINI_API_KEY or GEMINI_API_KEY in your environment.");
  process.exit(1);
}

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-1.0-pro"
];

const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
  const model = genAI.getGenerativeModel({ model: modelName });
  const start = Date.now();
  try {
    // Small and cheap call to validate availability
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: "ping" }] }] });
    const text = result?.response?.text?.() ?? "<no text>";
    const ms = Date.now() - start;
    return { model: modelName, ok: true, ms, sample: String(text).slice(0, 60) };
  } catch (err) {
    const ms = Date.now() - start;
    const status = err?.status || err?.response?.status;
    return { model: modelName, ok: false, ms, status, error: err?.message || String(err) };
  }
}

(async () => {
  console.log("Testing Gemini models...\n");
  const results = [];
  for (const name of MODELS) {
    /* eslint-disable no-await-in-loop */
    const res = await testModel(name);
    results.push(res);
    if (res.ok) {
      console.log(`[OK]  ${name}  ${res.ms}ms  sample="${res.sample}"`);
    } else {
      console.log(`[ERR] ${name}  ${res.ms}ms  status=${res.status ?? "n/a"}  ${res.error}`);
    }
  }
  const ok = results.filter(r => r.ok).map(r => r.model);
  const fail = results.filter(r => !r.ok).map(r => `${r.model}(${r.status ?? "n/a"})`);
  console.log("\nSummary:")
  console.log("  Available:", ok.length ? ok.join(", ") : "<none>");
  console.log("  Failing:", fail.length ? fail.join(", ") : "<none>");
  if (ok.length) {
    console.log(`\nSuggested model: ${ok[0]} (fastest working above)`);
  } else {
    process.exitCode = 2;
  }
})();




