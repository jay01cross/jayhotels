import { prismadb } from "@/lib/prismadb";

import { auth } from "@clerk/nextjs/server";

export const getHotelsByUserId = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized!!!");
  }

  try {
    const hotels = await prismadb?.hotel.findMany({
      where: { userId },
      include: { rooms: true },
    });

    if (!hotels) return null;

    // console.log(hotel);

    return hotels;
  } catch (error) {
    // throw new Error(error);
    console.error(error);
  }
};
