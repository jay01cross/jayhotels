import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

import { prismadb } from "@/lib/prismadb";

// getting all bookings
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!params.id) {
      return new NextResponse("Hotel Id is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await prismadb.booking.findMany({
      where: {
        paymentStatus: true,
        roomId: params.id,
        endDate: { gt: yesterday },
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error at /api/booking/id GET", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// updating the payment status
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!params.id) {
      return new NextResponse("Payment Intent Id is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const booking = await prismadb.booking.update({
      where: { paymentIntentId: params.id },
      data: { paymentStatus: true },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error at /api/booking/id PATCH", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// deleting the booking
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!params.id) {
      return new NextResponse("Booking Id is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const booking = await prismadb.booking.delete({
      where: { id: params.id },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error at /api/booking/id DELETE", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
