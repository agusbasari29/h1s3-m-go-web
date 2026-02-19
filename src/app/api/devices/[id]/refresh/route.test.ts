/* eslint-disable @typescript-eslint/no-explicit-any */
import { POST } from "@/app/api/devices/[id]/refresh/route";

describe("POST /api/devices/:id/refresh", () => {
  it("should refresh device data", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/1/refresh",
      {
        method: "POST",
      },
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty("id");
  });

  it("should return 404 for non-existent device", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/999/refresh",
      {
        method: "POST",
      },
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
  });
});
