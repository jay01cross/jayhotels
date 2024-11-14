import { getHotelById } from "@/actions/getHotelById";

import AddHotelForm from "@/components/hotel/AddHotelForm";

import { auth } from "@clerk/nextjs/server";

interface HotelPageProps {
  params: { hotelId: string };
}

const SingleHotel = async ({ params }: HotelPageProps) => {
  const hotel = await getHotelById(params.hotelId);

  const { userId } = auth();

  console.log(userId);

  if (!userId) return <div>Not authenticated...</div>;

  if (!hotel) return <div>No hotel found!!!</div>;

  if (hotel && hotel.userId !== userId) return <div>Access Denied...</div>;

  return (
    <div className="">
      <AddHotelForm hotel={hotel} />
    </div>
  );
};

export default SingleHotel;
