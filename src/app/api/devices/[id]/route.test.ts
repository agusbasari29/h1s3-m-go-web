/* eslint-disable */
import { GET, PUT, DELETE } from "@/app/api/devices/[id]/route";

const mockParams = Promise.resolve({ id: "1" });

describe("GET /api/devices/:id", () => {
  it("should return a single device", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/1",
    );
    const response = await GET(request, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty("id");
    expect(data.data.id).toBe("1");
  });

  it("should return 404 for non-existent device", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/999",
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "999" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });
});

describe("PUT /api/devices/:id", () => {
  it("should update a device", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/1",
      {
        method: "PUT",
        body: JSON.stringify({ name: "Updated Device" }),
      },
    );
    const response = await PUT(request, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe("Updated Device");
  });

  it("should return 404 for non-existent device", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/999",
      {
        method: "PUT",
        body: JSON.stringify({ name: "Updated" }),
      },
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/devices/:id", () => {
  it("should delete a device", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/1",
      {
        method: "DELETE",
      },
    );
    const response = await DELETE(request, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should return 404 for non-existent device", async () => {
    const request = new (global as any).NextRequest(
      "http://localhost:3000/api/devices/999",
      {
        method: "DELETE",
      },
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
  });
});
