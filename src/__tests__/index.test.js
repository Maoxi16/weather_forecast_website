/* eslint-disable no-undef */
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import "expect-puppeteer";

describe("Address submission", () => {
  let logs = [];

  beforeAll(async () => {
    page.on("console", (msg) => logs.push(msg.text()));
    await page.goto("http://localhost:3000");
  });

  beforeEach(async () => {
    logs = [];
  });

  it("submit button should log the address", async () => {
    await expect(page).toFill("#address", "123 Main Street");
    await expect(page).toClick("#address-submit");
    expect(logs).toContain("123 Main Street");
    expect(logs.length).toBe(1);
  });

  it("should log the address when enter is pushed in the input box", async () => {
    await expect(page).toFill(
      "#address",
      `456 Main Street${String.fromCharCode(13)}`
    );

    expect(logs).toContain("456 Main Street");
    expect(logs.length).toBe(1);
  });
});
