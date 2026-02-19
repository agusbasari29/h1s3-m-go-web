import { NextRequest, NextResponse } from "next/server";
import { Device, DeviceStatus, ApiResponse } from "@/types/device";

const MOCK_DEVICES: Device[] = [
  {
    id: "1",
    name: "ONT-Router-001",
    type: "router",
    ipAddress: "192.168.1.1",
    macAddress: "00:11:22:33:44:55",
    status: DeviceStatus.ONLINE,
    lastSeen: new Date().toISOString(),
    location: "Office Floor 1",
    tags: ["production", "core"],
    metrics: {
      cpu: 45,
      memory: 62,
      disk: 38,
      networkIn: 1024,
      networkOut: 512,
      temperature: 42,
      uptime: 864000,
    },
  },
  {
    id: "2",
    name: "ONT-Switch-001",
    type: "switch",
    ipAddress: "192.168.1.2",
    macAddress: "00:11:22:33:44:56",
    status: DeviceStatus.ONLINE,
    lastSeen: new Date().toISOString(),
    location: "Server Room",
    tags: ["production", "network"],
    metrics: {
      cpu: 28,
      memory: 45,
      disk: 22,
      networkIn: 2048,
      networkOut: 1536,
      temperature: 38,
      uptime: 1728000,
    },
  },
  {
    id: "3",
    name: "ONT-AP-001",
    type: "access_point",
    ipAddress: "192.168.1.3",
    macAddress: "00:11:22:33:44:57",
    status: DeviceStatus.WARNING,
    lastSeen: new Date(Date.now() - 300000).toISOString(),
    location: "Office Floor 2",
    tags: ["production", "wifi"],
    metrics: {
      cpu: 78,
      memory: 85,
      disk: 15,
      networkIn: 512,
      networkOut: 256,
      temperature: 55,
      uptime: 432000,
    },
  },
  {
    id: "4",
    name: "ONT-Firewall-001",
    type: "firewall",
    ipAddress: "192.168.1.254",
    macAddress: "00:11:22:33:44:58",
    status: DeviceStatus.OFFLINE,
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    location: "Server Room",
    tags: ["production", "security"],
  },
  {
    id: "5",
    name: "ONT-Gateway-001",
    type: "gateway",
    ipAddress: "192.168.0.1",
    macAddress: "00:11:22:33:44:59",
    status: DeviceStatus.MAINTENANCE,
    lastSeen: new Date().toISOString(),
    location: "Server Room",
    tags: ["maintenance"],
  },
];

let devices = [...MOCK_DEVICES];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<Device>>> {
  try {
    const { id } = await params;
    const device = devices.find((d) => d.id === id);

    if (!device) {
      return NextResponse.json(
        { success: false, data: {} as Device, message: "Device not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: device,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, data: {} as Device, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<Device>>> {
  try {
    const { id } = await params;
    const deviceIndex = devices.findIndex((d) => d.id === id);

    if (deviceIndex === -1) {
      return NextResponse.json(
        { success: false, data: {} as Device, message: "Device not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const updatedDevice: Device = {
      ...devices[deviceIndex],
      ...body,
      id: devices[deviceIndex].id,
      lastSeen: new Date().toISOString(),
    };

    devices[deviceIndex] = updatedDevice;

    return NextResponse.json({
      success: true,
      data: updatedDevice,
      message: "Device updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, data: {} as Device, message: "Invalid request body" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<Device>>> {
  try {
    const { id } = await params;
    const deviceIndex = devices.findIndex((d) => d.id === id);

    if (deviceIndex === -1) {
      return NextResponse.json(
        { success: false, data: {} as Device, message: "Device not found" },
        { status: 404 },
      );
    }

    const deletedDevice = devices.splice(deviceIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedDevice,
      message: "Device deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, data: {} as Device, message: "Internal server error" },
      { status: 500 },
    );
  }
}
