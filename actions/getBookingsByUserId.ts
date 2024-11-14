import { prismadb } from "@/lib/prismadb";

import { auth } from "@clerk/nextjs/server";

export const getBookingsByUserId = async () => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized!!!");

  try {
    const bookings = await prismadb.booking.findMany({
      where: { userId },
      include: { Room: true, Hotel: true },
      orderBy: { createdAt: "desc" },
    });

    if (!bookings) return null;

    return bookings;
  } catch (error: any) {
    console.error(error);
    // throw new Error(error);
  }
};
