const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { chromium } = require("playwright");
require("dotenv").config();

const Product = require("../models/product.model");
const User = require("../models/user.model");

const BASE_URL = `http://127.0.0.1:${process.env.PORT || 3000}`;
const OUTPUT_DIR = path.join(__dirname, "..", "docs", "screenshots");

const USER_EMAIL = process.env.SCREENSHOT_USER_EMAIL || "levana@gmail.com";
const USER_PASSWORD = process.env.SCREENSHOT_USER_PASSWORD || "123456";
const ADMIN_EMAIL = process.env.SCREENSHOT_ADMIN_EMAIL || "levana@gmail.com";
const ADMIN_PASSWORD = process.env.SCREENSHOT_ADMIN_PASSWORD || "123";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

async function connectDb() {
  if (!process.env.MONGO_URL) {
    throw new Error("Missing MONGO_URL in environment");
  }
  await mongoose.connect(process.env.MONGO_URL);
}

async function getFirstProductId() {
  const product = await Product.findOne({ deleted: false, status: "active" })
    .select("_id")
    .lean();
  return product ? String(product._id) : null;
}

async function getRealtimeUserToken() {
  const preferredUser = await User.findOne({
    email: USER_EMAIL,
    deleted: false,
    status: "active",
  })
    .select("tokenUser")
    .lean();

  if (preferredUser?.tokenUser) {
    return preferredUser.tokenUser;
  }

  const fallbackUser = await User.findOne({
    deleted: false,
    status: "active",
  })
    .select("tokenUser")
    .lean();

  return fallbackUser?.tokenUser || null;
}

async function takePublicScreenshots(browser, productId) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, "home-dashboard.png"),
    fullPage: true,
  });

  await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, "products-catalog.png"),
    fullPage: true,
  });

  if (productId) {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.evaluate(
      async ({ productId }) => {
        const body = new URLSearchParams({ quantity: "1" }).toString();
        await fetch(`/cart/add/${productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          credentials: "include",
        });
      },
      { productId },
    );

    await page.goto(`${BASE_URL}/checkout?id=${productId}`, {
      waitUntil: "networkidle",
    });
  } else {
    await page.goto(`${BASE_URL}/cart`, { waitUntil: "networkidle" });
  }

  await page.screenshot({
    path: path.join(OUTPUT_DIR, "cart-checkout.png"),
    fullPage: true,
  });

  await context.close();
}

async function takeAdminScreenshot(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/admin/auth/login`, { waitUntil: "networkidle" });

  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');

  if ((await emailInput.count()) > 0 && (await passwordInput.count()) > 0) {
    await emailInput.first().fill(ADMIN_EMAIL);
    await passwordInput.first().fill(ADMIN_PASSWORD);

    const submit = page.locator('button[type="submit"], input[type="submit"]');
    if ((await submit.count()) > 0) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }),
        submit.first().click(),
      ]);
    }
  }

  await page.goto(`${BASE_URL}/admin/dashboard`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, "admin-dashboard.png"),
    fullPage: true,
  });

  await context.close();
}

async function takeRealtimeScreenshot(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/user/login`, { waitUntil: "networkidle" });

  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');

  if ((await emailInput.count()) > 0 && (await passwordInput.count()) > 0) {
    const candidatePasswords = [USER_PASSWORD, "123", "123456"];
    const submit = page.locator('button[type="submit"], input[type="submit"]');

    for (const candidatePassword of candidatePasswords) {
      await emailInput.first().fill(USER_EMAIL);
      await passwordInput.first().fill(candidatePassword);

      if ((await submit.count()) > 0) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle" }),
          submit.first().click(),
        ]);
      }

      if (!page.url().includes("/user/login")) {
        break;
      }
    }
  }

  await page.goto(`${BASE_URL}/rooms-chat`, { waitUntil: "networkidle" });

  if (page.url().includes("/user/login")) {
    const tokenUser = await getRealtimeUserToken();
    if (tokenUser) {
      await context.addCookies([
        {
          name: "tokenUser",
          value: tokenUser,
          domain: "127.0.0.1",
          path: "/",
          httpOnly: false,
          secure: false,
        },
      ]);
      await page.goto(`${BASE_URL}/rooms-chat`, { waitUntil: "networkidle" });
    }
  }

  const chatLink = page.locator('a[href^="/chat/"]');
  if ((await chatLink.count()) > 0) {
    await Promise.all([
      page.waitForLoadState("networkidle"),
      chatLink.first().click(),
    ]);
  }

  await page.screenshot({
    path: path.join(OUTPUT_DIR, "realtime-chat.png"),
    fullPage: true,
  });

  await context.close();
}

(async () => {
  ensureDir(OUTPUT_DIR);

  await connectDb();
  const productId = await getFirstProductId();

  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "msedge" });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  try {
    await takePublicScreenshots(browser, productId);
    await takeAdminScreenshot(browser);
    await takeRealtimeScreenshot(browser);
  } finally {
    await browser.close();
    await mongoose.disconnect();
  }

  console.log("Screenshots captured successfully in docs/screenshots");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
