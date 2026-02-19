/* eslint-disable */
import { GET, POST } from "@/app/api/devices/route";

describe("GET /api/devices", () => {
  it("should return paginated devices", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty("data");
    expect(data.data).toHaveProperty("pagination");
    expect(Array.isArray(data.data.data)).toBe(true);
  });

  it("should filter by status", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices?status=online",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should filter by type", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices?type=router",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should filter by search term", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices?search=ONT",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should support pagination", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices?page=1&limit=2",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.pagination.limit).toBe(2);
    expect(data.data.pagination.page).toBe(1);
  });
});

describe("POST /api/devices", () => {
  it("should create a new device", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Test Device",
          type: "router",
          ipAddress: "192.168.1.100",
          macAddress: "00:11:22:33:44:FF",
          location: "Test Location",
        }),
      },
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe("Test Device");
  });

  it("should return 400 for invalid request", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices",
      {
        method: "POST",
        body: JSON.stringify({}),
      },
    );
    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
