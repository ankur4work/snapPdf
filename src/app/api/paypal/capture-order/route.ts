import { NextRequest, NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal/paypalClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderID } = body as { orderID: string };

    if (!orderID || typeof orderID !== "string") {
      return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
    }

    const order = await captureOrder(orderID);
    return NextResponse.json({ status: order.status, id: order.id });
  } catch (err) {
    console.error("[capture-order]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to capture order" },
      { status: 500 }
    );
  }
}
