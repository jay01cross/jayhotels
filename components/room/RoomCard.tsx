"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";

import { Booking, Hotel, Room } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import AmenityItem from "../AmenityItem";

import {
  AirVent,
  Bed,
  BedDouble,
  Castle,
  Home,
  Loader2,
  MountainSnow,
  Pencil,
  Ship,
  Trash,
  Trees,
  Tv,
  UtensilsCrossed,
  VolumeX,
  Wand2,
  Wifi,
} from "lucide-react";

import { Separator } from "../ui/separator";

import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import AddRoomForm from "./AddRoomForm";

import axios from "axios";

import { useToast } from "@/hooks/use-toast";

import { DatePickerWithRange } from "./DateRangePicker";

import { DateRange } from "react-day-picker";

import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";

import { Checkbox } from "../ui/checkbox";

import { useAuth } from "@clerk/nextjs";

import useBookRoom from "@/hooks/useBookRoom";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();

  const [isLoading, setIsLoading] = useState(false);

  const [bookingIsLoading, setBookingIsLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>();

  const [totalPrice, setTotalPrice] = useState(room.roomPrice);

  const [includeBreakfast, setIncludeBreakfast] = useState(false);

  const [days, setDays] = useState(1);

  const pathname = usePathname();

  const router = useRouter();

  const { toast } = useToast();

  const { userId } = useAuth();

  const isHotelDetailsPage = pathname.includes("hotel-details");

  const isBookRoom = pathname.includes("book-room");

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      setDays(dayCount);

      if (dayCount && room.roomPrice) {
        if (includeBreakfast && room.breakfastPrice) {
          setTotalPrice(
            dayCount * room.roomPrice + dayCount * room.breakfastPrice
          );
        } else {
          setTotalPrice(dayCount * room.roomPrice);
        }
      } else {
        setTotalPrice(room.roomPrice);
      }
    }
  }, [date, room.roomPrice, includeBreakfast, room.breakfastPrice]);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.id && booking.paymentStatus
    );

    roomBookings.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [bookings, room.id]);

  const handleDialogOpen = () => {
    setOpenDialog((prev) => !prev);
  };

  const handleRoomDelete = (room: Room) => {
    setIsLoading(true);

    const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            router.refresh();
            toast({ variant: "success", description: "Room Deleted!" });
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              description: "Something went wrong!",
            });
          });
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Something went wrong!",
        });
      });
  };

  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Oops! Make sure you are logged in.",
      });

    if (!hotel?.userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong, refresh the page and try again!",
      });

    if (date?.from && date?.to) {
      setBookingIsLoading(true);

      const bookingRoomData = {
        room,
        totalPrice,
        breakfastIncluded: includeBreakfast,
        startDate: date.from,
        endDate: date.to,
      };

      setRoomData(bookingRoomData);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakfastIncluded: includeBreakfast,
            totalPrice: totalPrice,
          },
          payment_intent_id: paymentIntentId,
        }),
      })
        .then((res) => {
          setBookingIsLoading(false);

          if (res.status === 401) {
            return router.push("/login");
          }

          return res.json();
        })
        .then((data) => {
          setClientSecret(data.paymentIntent.client_secret);
          setPaymentIntentId(data.paymentIntent.id);
          router.push("/book-room");
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    } else {
      toast({
        variant: "destructive",
        description: "Oops! Select Date.",
      });
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            src={room.image}
            alt={room.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="size-4" /> {room.bedCount} Bed
            {room.bedCount > 1 && "s"}
          </AmenityItem>

          <AmenityItem>
            <Bed className="size-4" /> {room.guestCount} Guest
            {room.guestCount > 1 && "s"}
          </AmenityItem>

          <AmenityItem>
            <Bed className="size-4" /> {room.bathroomCount} Bathroom
            {room.bathroomCount > 1 && "s"}
          </AmenityItem>

          {!!room.kingBed && (
            <AmenityItem>
              <BedDouble className="size-4" /> {room.kingBed} King Bed
              {room.kingBed > 1 && "s"}
            </AmenityItem>
          )}

          {!!room.queenBed && (
            <AmenityItem>
              <BedDouble className="size-4" /> {room.queenBed} Queen Bed
              {room.queenBed > 1 && "s"}
            </AmenityItem>
          )}

          {room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="size-4" /> Room Services
            </AmenityItem>
          )}

          {room.TV && (
            <AmenityItem>
              <Tv className="size-4" /> TV
            </AmenityItem>
          )}

          {room.balcony && (
            <AmenityItem>
              <Home className="size-4" /> Balcony
            </AmenityItem>
          )}

          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="size-4" /> Free Wifi
            </AmenityItem>
          )}

          {room.cityView && (
            <AmenityItem>
              <Castle className="size-4" /> City View
            </AmenityItem>
          )}

          {room.oceanView && (
            <AmenityItem>
              <Ship className="size-4" /> Ocean View
            </AmenityItem>
          )}

          {room.forestView && (
            <AmenityItem>
              <Trees className="size-4" /> Forest View
            </AmenityItem>
          )}

          {room.mountainView && (
            <AmenityItem>
              <MountainSnow className="size-4" /> Mountain View
            </AmenityItem>
          )}

          {room.airCondition && (
            <AmenityItem>
              <AirVent className="size-4" /> Air Condition
            </AmenityItem>
          )}

          {room.soundProofed && (
            <AmenityItem>
              <VolumeX className="size-4" /> Sound Proofed
            </AmenityItem>
          )}
        </div>

        <Separator />

        <div className="flex gap-4 justify-between">
          <div>
            Room Price: <span className="font-bold">${room.roomPrice}</span>
            <span className="text-xs"> / 24hrs</span>
          </div>

          {!!room.breakfastPrice && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">${room.breakfastPrice}</span>
            </div>
          )}
        </div>

        <Separator />
      </CardContent>

      {!isBookRoom && (
        <CardFooter>
          {isHotelDetailsPage ? (
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-2">
                  Select days that you will spend in this room.
                </div>
                <DatePickerWithRange
                  date={date}
                  setDate={setDate}
                  disabledDates={disabledDates}
                />
              </div>

              {room.breakfastPrice > 0 && (
                <div>
                  <div>Dou you want to be served breakfast each day?</div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="breakfast"
                      onCheckedChange={(value) => setIncludeBreakfast(!!value)}
                    />
                    <label htmlFor="breakfast" className="text-sm">
                      Include Breakfast
                    </label>
                  </div>
                </div>
              )}

              <div>
                Total Price: <span className="font-bold">${totalPrice}</span>{" "}
                for{" "}
                <span className="font-bold">
                  {days} Day{days > 1 ? "s" : ""}
                </span>
              </div>

              <Button
                disabled={bookingIsLoading}
                type="button"
                onClick={() => handleBookRoom()}
              >
                {bookingIsLoading ? (
                  <Loader2 className="mr-2 size-4" />
                ) : (
                  <Wand2 className="mr-2 size-4" />
                )}

                {bookingIsLoading ? "Loading..." : "Book Room"}
              </Button>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <Button
                disabled={isLoading}
                type="button"
                variant="ghost"
                onClick={() => handleRoomDelete(room)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 size-4" /> Delete
                  </>
                )}
              </Button>

              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    className="max-w-[150px]"
                  >
                    <Pencil className="mr-2 size-4" /> Update Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[900px] w-[90%]">
                  <DialogHeader className="px-2">
                    <DialogTitle>Update Room</DialogTitle>
                    <DialogDescription>
                      Make changes to this room.
                    </DialogDescription>
                  </DialogHeader>

                  <AddRoomForm
                    hotel={hotel}
                    room={room}
                    handleDialogOpen={handleDialogOpen}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default RoomCard;
