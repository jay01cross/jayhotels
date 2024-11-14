import { getBookings } from "@/actions/getBookings";

import { getHotelById } from "@/actions/getHotelById";

import HotelDetailsClient from "@/components/hotel/HotelDetailsClient";

interface HotelDetailProps {
  params: {
    hotelId: string;
  };
}

const HoteDetails = async ({ params }: HotelDetailProps) => {
  console.log(params.hotelId);
  const hotel = await getHotelById(params.hotelId);

  if (!hotel) return <div>Ooops! Hotel with given id not found</div>;

  const bookings = await getBookings(hotel.id);

  return (
    <div className="">
      <HotelDetailsClient hotel={hotel} bookings={bookings} />
    </div>
  );
};

export default HoteDetails;
