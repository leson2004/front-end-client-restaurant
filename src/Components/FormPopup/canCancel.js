import { differenceInHours } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const canCancelReservation = (reservationDate) => {
  const timeZone = "Asia/Ho_Chi_Minh"; // Múi giờ Việt Nam

  // Lấy thời gian hiện tại
  const now = new Date();

  // Chuyển thời gian hiện tại sang múi giờ Việt Nam
  const zonedNow = toZonedTime(now, timeZone);

  // Chuyển thời gian đặt chỗ từ UTC sang múi giờ Việt Nam
  const zonedReservationDate = toZonedTime(new Date(reservationDate), timeZone);

  // Tính sự khác biệt giờ giữa thời gian đặt chỗ và thời gian hiện tại
  const hoursDifference = differenceInHours(zonedReservationDate, zonedNow);

  // console.log("UTC Reservation Date:", reservationDate);
  // console.log("Zoned Reservation Date:", zonedReservationDate);
  // console.log("Current Zoned Time:", zonedNow);
  // console.log("Hours Difference:", hoursDifference);

  // Kiểm tra nếu thời gian còn hơn 2 giờ thì có thể hủy
  return hoursDifference >= 2;
};
