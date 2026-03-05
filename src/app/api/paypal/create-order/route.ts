import { NextResponse } from "next/server";
import { createOrder } from "@/lib/paypal/paypalClient";

export async function POST() {
  try {
    const order = await createOrder("5.00");
    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error("[create-order]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
