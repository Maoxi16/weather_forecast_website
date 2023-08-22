/* eslint-disable no-undef */
import { buildCensusURL, extractResultFromResponse } from "../geocode";

describe("address URL", () => {
  test("build endpoint url from example", () => {
    expect(buildCensusURL("4600 Silver Hill Rd, Washington, DC 20233")).toBe(
      "http://localhost:3000/address?address=4600+Silver+Hill+Rd%2C+Washington%2C+DC+20233&benchmark=2020&format=json"
    );
  });

  test("we should extract the first result from the response", async () => {
    const response = new Response(
      JSON.stringify({
        result: {
          input: {
            address: { address: "4600 Silver Hill Rd, Washington, DC 20233" },
            benchmark: {
              isDefault: false,
              benchmarkDescription:
                "Public Address Ranges - Census 2020 Benchmark",
              id: "2020",
              benchmarkName: "Public_AR_Census2020",
            },
          },
          addressMatches: [
            {
              tigerLine: { side: "L", tigerLineId: "76355984" },
              coordinates: { x: -76.92743610939091, y: 38.84598652130676 },
              addressComponents: {
                zip: "20233",
                streetName: "SILVER HILL",
                preType: "",
                city: "WASHINGTON",
                preDirection: "",
                suffixDirection: "",
                fromAddress: "4600",
                state: "DC",
                suffixType: "RD",
                toAddress: "4700",
                suffixQualifier: "",
                preQualifier: "",
              },
              matchedAddress: "4600 SILVER HILL RD, WASHINGTON, DC, 20233",
            },
          ],
        },
      })
    );

    const result = await extractResultFromResponse(response);
    expect(result.matchedAddress).toBe(
      "4600 SILVER HILL RD, WASHINGTON, DC, 20233"
    );
  });

  test("we should reject the promise if no address is returned", async () => {
    const response = new Response(
      JSON.stringify({ result: { addressMatches: [] } })
    );

    await expect(extractResultFromResponse(response)).rejects.toStrictEqual(
      new Error("no match found")
    );
  });
});
