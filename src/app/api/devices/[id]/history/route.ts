import { NextRequest, NextResponse } from "next/server";
import { DeviceHistory, DeviceStatus, ApiResponse } from "@/types/device";

function generateMockHistory(
  deviceId: string,
  limit: number = 50,
): DeviceHistory[] {
  const statuses = [
    DeviceStatus.ONLINE,
    DeviceStatus.OFFLINE,
    DeviceStatus.WARNING,
  ];

  const history: DeviceHistory[] = [];
  const now = Date.now();

  for (let i = 0; i < limit; i++) {
    const timestamp = new Date(now - i * 300000).toISOString();
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    history.push({
      id: `${deviceId}-history-${i}`,
      deviceId,
      timestamp,
      status,
      event:
        status === DeviceStatus.WARNING ? "High CPU usage detected" : undefined,
      metrics: {
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100),
        networkIn: Math.floor(Math.random() * 5000),
        networkOut: Math.floor(Math.random() * 3000),
        temperature: Math.floor(Math.random() * 40) + 30,
        uptime: Math.floor(Math.random() * 1000000),
      },
    });
  }

  return history;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<DeviceHistory[]>>> {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit") as string, 10)
      : 50;
    const start = searchParams.get("start") || undefined;
    const end = searchParams.get("end") || undefined;

    let history = generateMockHistory(id, limit);

    if (start) {
      history = history.filter((h) => new Date(h.timestamp) >= new Date(start));
    }

    if (end) {
      history = history.filter((h) => new Date(h.timestamp) <= new Date(end));
    }

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, data: [], message: "Internal server error" },
      { status: 500 },
    );
  }
}
