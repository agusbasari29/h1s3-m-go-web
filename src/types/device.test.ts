import {
  DeviceStatus,
  Device,
  DeviceMetrics,
  DeviceHistory,
  Pagination,
} from "./device";

describe("DeviceStatus enum", () => {
  it("has correct values", () => {
    expect(DeviceStatus.ONLINE).toBe("online");
    expect(DeviceStatus.OFFLINE).toBe("offline");
    expect(DeviceStatus.WARNING).toBe("warning");
    expect(DeviceStatus.ERROR).toBe("error");
    expect(DeviceStatus.MAINTENANCE).toBe("maintenance");
  });
});

describe("Device interface", () => {
  it("accepts valid device object", () => {
    const device: Device = {
      id: "1",
      name: "Test Device",
      type: "server",
      ipAddress: "192.168.1.1",
      macAddress: "00:11:22:33:44:55",
      status: DeviceStatus.ONLINE,
      lastSeen: new Date().toISOString(),
    };

    expect(device.id).toBe("1");
    expect(device.status).toBe(DeviceStatus.ONLINE);
  });

  it("accepts optional fields", () => {
    const device: Device = {
      id: "1",
      name: "Test Device",
      type: "server",
      ipAddress: "192.168.1.1",
      macAddress: "00:11:22:33:44:55",
      status: DeviceStatus.ONLINE,
      lastSeen: new Date().toISOString(),
      location: "Data Center A",
      tags: ["production", "critical"],
      metrics: {
        cpu: 50,
        memory: 60,
        disk: 70,
        networkIn: 100,
        networkOut: 50,
        uptime: 3600,
      },
    };

    expect(device.location).toBe("Data Center A");
    expect(device.tags).toHaveLength(2);
    expect(device.metrics?.cpu).toBe(50);
  });
});

describe("DeviceMetrics interface", () => {
  it("accepts valid metrics object", () => {
    const metrics: DeviceMetrics = {
      cpu: 75.5,
      memory: 82.3,
      disk: 45.0,
      networkIn: 1024,
      networkOut: 512,
      uptime: 86400,
    };

    expect(metrics.cpu).toBe(75.5);
    expect(metrics.uptime).toBe(86400);
  });

  it("accepts optional temperature", () => {
    const metrics: DeviceMetrics = {
      cpu: 50,
      memory: 60,
      disk: 70,
      networkIn: 100,
      networkOut: 50,
      temperature: 65,
      uptime: 3600,
    };

    expect(metrics.temperature).toBe(65);
  });
});

describe("DeviceHistory interface", () => {
  it("accepts valid history object", () => {
    const history: DeviceHistory = {
      id: "h1",
      deviceId: "d1",
      timestamp: new Date().toISOString(),
      status: DeviceStatus.ONLINE,
      metrics: {
        cpu: 50,
        memory: 60,
        disk: 70,
        networkIn: 100,
        networkOut: 50,
        uptime: 3600,
      },
    };

    expect(history.deviceId).toBe("d1");
    expect(history.status).toBe(DeviceStatus.ONLINE);
  });

  it("accepts optional event field", () => {
    const history: DeviceHistory = {
      id: "h1",
      deviceId: "d1",
      timestamp: new Date().toISOString(),
      status: DeviceStatus.ERROR,
      metrics: {
        cpu: 100,
        memory: 90,
        disk: 80,
        networkIn: 0,
        networkOut: 0,
        uptime: 0,
      },
      event: "Device went offline",
    };

    expect(history.event).toBe("Device went offline");
  });
});

describe("Pagination interface", () => {
  it("accepts valid pagination object", () => {
    const pagination: Pagination = {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    };

    expect(pagination.page).toBe(1);
    expect(pagination.totalPages).toBe(10);
  });
});
