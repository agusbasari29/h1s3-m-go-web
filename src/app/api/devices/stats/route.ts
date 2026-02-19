import { NextRequest, NextResponse } from "next/server";
import { DeviceStatus, ApiResponse, DeviceStats } from "@/types/device";

const MOCK_DEVICES = [
  { id: "1", status: DeviceStatus.ONLINE },
  { id: "2", status: DeviceStatus.ONLINE },
  { id: "3", status: DeviceStatus.WARNING },
  { id: "4", status: DeviceStatus.OFFLINE },
  { id: "5", status: DeviceStatus.MAINTENANCE },
];

export async function GET(
  _request: NextRequest,
): Promise<NextResponse<ApiResponse<DeviceStats>>> {
  try {
    const stats: DeviceStats = {
      total: MOCK_DEVICES.length,
      online: MOCK_DEVICES.filter((d) => d.status === DeviceStatus.ONLINE)
        .length,
      offline: MOCK_DEVICES.filter((d) => d.status === DeviceStatus.OFFLINE)
        .length,
      warning: MOCK_DEVICES.filter((d) => d.status === DeviceStatus.WARNING)
        .length,
      error: MOCK_DEVICES.filter((d) => d.status === DeviceStatus.ERROR).length,
      maintenance: MOCK_DEVICES.filter(
        (d) => d.status === DeviceStatus.MAINTENANCE,
      ).length,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: {
          total: 0,
          online: 0,
          offline: 0,
          warning: 0,
          error: 0,
          maintenance: 0,
        },
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
