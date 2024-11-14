import { getBookingsByHotelOwnerId } from "@/actions/getBookingsByHotelOwnerId";

import { getBookingsByUserId } from "@/actions/getBookingsByUserId";
import MyBookingsClient from "@/components/booking/MyBookingsClient";

const MyBookings = async () => {
  const bookingsByHotelOwner = await getBookingsByHotelOwnerId();

  const bookingsByUserId = await getBookingsByUserId();

  if (!bookingsByHotelOwner && !bookingsByUserId)
    return <div>No Bookings Found...</div>;

  return (
    <div className="flex flex-col gap-10">
      {!!bookingsByUserId?.length && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
            Here are bookings you have made
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsByUserId.map((booking) => (
              <MyBookingsClient key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {!!bookingsByHotelOwner?.length && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
            Here are bookings visitors have made on your properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsByHotelOwner.map((booking) => (
              <MyBookingsClient key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
