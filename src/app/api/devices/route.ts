import { NextRequest, NextResponse } from "next/server";
import {
  Device,
  DeviceStatus,
  DeviceFilters,
  PaginatedResponse,
  ApiResponse,
} from "@/types/device";

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

function applyFilters(
  deviceList: Device[],
  filters?: DeviceFilters,
): PaginatedResponse<Device> {
  let filtered = [...deviceList];

  if (filters?.status) {
    filtered = filtered.filter((d) => d.status === filters.status);
  }

  if (filters?.type) {
    filtered = filtered.filter((d) => d.type === filters.type);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(search) ||
        d.ipAddress.includes(search) ||
        d.macAddress.toLowerCase().includes(search),
    );
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    pagination: { page, limit, total, totalPages },
  };
}

export async function GET(
  request: NextRequest,
): Promise<
  NextResponse<ApiResponse<PaginatedResponse<Device>> | ApiResponse<Device[]>>
> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: DeviceFilters = {
      status: (searchParams.get("status") as DeviceStatus) || undefined,
      type: searchParams.get("type") || undefined,
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page") as string, 10)
        : undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit") as string, 10)
        : undefined,
    };

    if (filters.status === undefined) delete filters.status;
    if (!filters.type) delete filters.type;
    if (!filters.search) delete filters.search;

    const result = applyFilters(devices, filters);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: {
          data: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        },
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Device>>> {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.type || !body.ipAddress || !body.macAddress) {
      return NextResponse.json(
        {
          success: false,
          data: {} as Device,
          message: "Missing required fields: name, type, ipAddress, macAddress",
        },
        { status: 400 },
      );
    }

    const newDevice: Device = {
      id: String(devices.length + 1),
      name: body.name,
      type: body.type,
      ipAddress: body.ipAddress,
      macAddress: body.macAddress,
      status: DeviceStatus.OFFLINE,
      lastSeen: new Date().toISOString(),
      location: body.location,
      tags: body.tags || [],
    };

    devices.push(newDevice);

    return NextResponse.json(
      {
        success: true,
        data: newDevice,
        message: "Device registered successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, data: {} as Device, message: "Invalid request body" },
      { status: 400 },
    );
  }
}
