/* eslint-disable */
import { GET } from "@/app/api/devices/[id]/history/route";

describe("GET /api/devices/:id/history", () => {
  it("should return device history", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/1/history",
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it("should respect limit parameter", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/1/history?limit=10",
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.length).toBeLessThanOrEqual(10);
  });

  it("should filter by date range", async () => {
    const start = new Date(Date.now() - 86400000).toISOString();
    const request = new (global as any).NextRequest(
      `http://localhost:3000/api/devices/1/history?start=${start}`,
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
