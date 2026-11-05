// Drives the production build in the installed Chrome. Run `npm run build` first.
// Set CHROME_PATH if Chrome isn't in the default macOS location.
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import puppeteer from "puppeteer-core";

const root = resolve(import.meta.dirname, "..");
const tmp = join(root, ".tmp");
const shots = join(tmp, "shots");
const downloads = join(tmp, "downloads");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(shots, { recursive: true });
mkdirSync(downloads, { recursive: true });

const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function serve(port, env) {
  const child = spawn("npx", ["next", "start", "-p", String(port)], {
    cwd: root,
    env: { ...process.env, GEMINI_API_KEY: "", MOCK_AI: "", ...env },
    stdio: "ignore",
    detached: true,
  });
  return child;
}

async function waitFor(url) {
  for (let i = 0; i < 60; i += 1) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server didn't start: ${url}`);
}

const servers = [serve(3100, { MOCK_AI: "1" }), serve(3101, {})];
let failures = 0;
const check = async (name, fn) => {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.log(`FAIL ${name}\n     ${error.message}`);
  }
};

const browser = await (async () => {
  await Promise.all([waitFor("http://localhost:3100/"), waitFor("http://localhost:3101/")]);
  return puppeteer.launch({ executablePath: chromePath, headless: true, userDataDir: join(tmp, "profile"), args: ["--no-first-run"] });
})();

const BASE = "http://localhost:3100";
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error" && !/status of (404|503)/.test(m.text())) consoleErrors.push(m.text());
});
const cdp = await page.createCDPSession();
await cdp.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: downloads });

const text = () => page.evaluate(() => document.body.innerText);
const clickText = (label, tag = "button,a") =>
  page.evaluate(
    (l, t) => {
      const el = [...document.querySelectorAll(t)].find((e) => e.innerText.trim().startsWith(l));
      if (!el) throw new Error(`No element: ${l}`);
      el.click();
    },
    label,
    tag,
  );
// innerText reflects CSS uppercase, so comparisons ignore case.
const until = (needle) => page.waitForFunction((n) => document.body.innerText.toLowerCase().includes(n.toLowerCase()), { timeout: 15000 }, needle);
const shot = (name) => page.screenshot({ path: join(shots, `${name}.png`), fullPage: true });
const pdfArrives = async (name) => {
  for (let i = 0; i < 40; i += 1) {
    if (readdirSync(downloads).includes(name)) {
      assert.ok(readFileSync(join(downloads, name)).subarray(0, 5).toString() === "%PDF-", "file isn't a PDF");
      return;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`No download: ${name}`);
};

await check("landing has honest copy and no fake numbers", async () => {
  await page.goto(BASE, { waitUntil: "networkidle0" });
  const t = await text();
  assert.ok(t.includes("Stop staring at a blank page."));
  for (const fake of ["1,200+", "5,800+", "94%", "supervisor-approved", "200+", "hi@fypmatch", "199 PKR"]) assert.ok(!t.includes(fake), fake);
  await shot("1-landing");
});

await check("wizard requires an interest", async () => {
  await page.goto(`${BASE}/generate`, { waitUntil: "networkidle0" });
  await until("Step 1 of 3");
  await shot("2a-step1");
  await clickText("Continue");
  await until("Step 2 of 3");
  await clickText("Generate 5 ideas");
  await until("Choose at least one interest");
});

await check("save & exit restores progress", async () => {
  await clickText("AI/ML");
  await clickText("EdTech");
  await clickText("Job abroad");
  await page.type("#tech", "React\n");
  await page.type("#tech", "Python\n");
  await page.type("#tech", "Firebase\n");
  await page.type("#tech", "TypeScript\n");
  await until("TypeScript");
  await shot("2b-step2");
  await clickText("Save & exit");
  await until("Continue your saved answers");
  await clickText("Continue your saved answers");
  await until("Step 2 of 3");
  const pressed = await page.$$eval('[aria-pressed="true"]', (els) => els.map((e) => e.innerText.trim()));
  assert.deepEqual(pressed, ["AI/ML", "EdTech"]);
  assert.ok((await text()).includes("TypeScript"));
});

await check("generates, and marks samples clearly in test mode", async () => {
  await clickText("Generate 5 ideas");
  await page.waitForFunction(() => location.pathname === "/results", { timeout: 15000 });
  await until("5 FYP ideas matched to your profile.");
  const t = await text();
  assert.ok(t.includes("Test mode"));
  assert.ok(t.includes("for SE student · AI/ML + EdTech · 6 months · team of 2"));
  assert.equal((await page.$$("article")).length, 5);
  await shot("3-results");
});

await check("downloads a real PDF of all ideas", async () => {
  await clickText("Download PDF");
  await pdfArrives("fypmatch-ideas.pdf");
});

await check("idea detail, use this idea, supervisor PDF", async () => {
  await clickText("View full breakdown");
  await until("At a glance");
  await shot("4-detail");
  const t = await text();
  assert.ok(t.includes("Rough estimate"));
  assert.ok(t.includes("Verify before citing"));
  await clickText("Use this idea");
  await until("Your next steps");
  await clickText("Export PDF for supervisor");
  await pdfArrives("fypmatch-idea-1.pdf");
});

await check("AI chat replies, and survives a reload", async () => {
  await clickText("Refine with AI chat");
  await until("Ask anything about this idea");
  await page.type('textarea[aria-label="Your message"]', "Make it simpler");
  await page.keyboard.press("Enter");
  await until("Test mode reply");
  await shot("5-chat");
  await page.reload({ waitUntil: "networkidle0" });
  await until("This is your idea");
  await clickText("Refine with AI chat");
  await until("Make it simpler");
  await page.keyboard.press("Escape");
});

await check("chosen idea shows on results, generate again works", async () => {
  await page.goto(`${BASE}/results`, { waitUntil: "networkidle0" });
  await until("Your pick");
  await clickText("Generate again");
  await page.waitForFunction(() => !document.body.innerText.includes("Your pick"), { timeout: 15000 });
});

await check("new search keeps the current ideas until new ones exist", async () => {
  await clickText("New search");
  await page.waitForFunction(() => location.pathname === "/generate");
  await page.goto(`${BASE}/results`, { waitUntil: "networkidle0" });
  assert.equal((await page.$$("article")).length, 5);
});

await check("examples are labelled and export works", async () => {
  await page.goto(`${BASE}/examples`, { waitUntil: "networkidle0" });
  assert.ok((await text()).includes("Sample output"));
  await shot("6-examples");
  await page.goto(`${BASE}/examples/2`, { waitUntil: "networkidle0" });
  await clickText("Export sample PDF");
  await pdfArrives("fypmatch-sample-2.pdf");
});

await check("pricing collects no payment", async () => {
  await page.goto(`${BASE}/pricing`, { waitUntil: "networkidle0" });
  const t = await text();
  assert.ok(t.includes("Coming soon"));
  assert.ok(!t.includes("199"));
  assert.equal(await page.$eval("button[disabled]", (b) => b.innerText.trim()), "Coming soon");
  await shot("7-pricing");
});

await check("404 page", async () => {
  const res = await page.goto(`${BASE}/nope`, { waitUntil: "networkidle0" });
  assert.equal(res.status(), 404);
  assert.ok((await text()).includes("This page doesn't exist."));
  assert.equal((await page.goto(`${BASE}/ideas/9`, { waitUntil: "networkidle0" })).status(), 404);
});

await check("no sideways scrolling at phone width", async () => {
  await page.setViewport({ width: 375, height: 800, isMobile: true, hasTouch: true });
  for (const path of ["/", "/generate", "/results", "/ideas/1", "/examples", "/examples/1", "/pricing", "/privacy"]) {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0" });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(over <= 0, `${path} overflows by ${over}px`);
    await shot(`m${path.replace(/\//g, "-")}`);
  }
  await page.setViewport({ width: 1440, height: 1000 });
});

await check("without a key: honest error, retry and no fake ideas", async () => {
  const noKey = await browser.newPage();
  await noKey.setViewport({ width: 1440, height: 1000 });
  await noKey.goto("http://localhost:3101/generate", { waitUntil: "networkidle0" });
  await noKey.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.innerText.startsWith("Continue")).click());
  await noKey.waitForFunction(() => document.body.innerText.includes("Step 2 of 3"));
  await noKey.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.innerText.trim() === "Web").click();
  });
  await noKey.waitForSelector('[aria-pressed="true"]');
  await noKey.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.innerText.startsWith("Generate 5")).click());
  await noKey.waitForFunction(() => document.body.innerText.includes("isn't configured"), { timeout: 15000 });
  const t = await noKey.evaluate(() => document.body.innerText);
  assert.ok(t.includes("Try again"));
  assert.ok(!t.includes("AI Code Review"));
  assert.equal(new URL(noKey.url()).pathname, "/generate");
  await noKey.screenshot({ path: join(shots, "8-no-key.png"), fullPage: true });
  await noKey.close();
});

await check("no browser errors during the run", async () => {
  assert.deepEqual(consoleErrors, []);
});

await browser.close();
for (const server of servers) {
  try {
    process.kill(-server.pid);
  } catch {}
}
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
