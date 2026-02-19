/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET } from "@/app/api/devices/stats/route";

describe("GET /api/devices/stats", () => {
  it("should return device statistics", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/stats",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty("total");
    expect(data.data).toHaveProperty("online");
    expect(data.data).toHaveProperty("offline");
    expect(data.data).toHaveProperty("warning");
    expect(data.data).toHaveProperty("error");
    expect(data.data).toHaveProperty("maintenance");
  });

  it("should have valid numeric values", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/stats",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(typeof data.data.total).toBe("number");
    expect(typeof data.data.online).toBe("number");
    expect(data.data.total).toBeGreaterThanOrEqual(0);
  });
});
