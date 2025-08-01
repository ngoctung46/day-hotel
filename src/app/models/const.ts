export enum RoomType {
  NORMAL = 0,
  DELUXE,
  VIP,
}
export enum RoomStatus {
  AVAILABLE = 0,
  CHECKED_IN,
  CUSTOMER_OUT,
  NEED_CLEANING_CUSTOMER_IN,
  NEED_CLEANING_CUSTOMER_OUT,
  BOOKED,
  UNDER_MAINTENANCE,
}
export enum RoomRate {
  NORMAL = 200_000,
  DELUXE = 250_000,
  VIP = 350_000,
}

export enum HourlyRate {
  NORMAL_OR_DELUXE = 80_000,
  VIP = 100_000,
}

export enum ProductType {
  BEVERAGES = 0,
  FOOD,
  ROOM_SERVICE,
  ROOM_RATE,
  EXTRA_FEE,
  DISCOUNT,
  PREPAID,
}

export enum CollectionName {
  ROOM = 'rooms',
  CUSTOMER = 'customers',
  ORDER = 'orders',
  ORDER_LINE = 'order_lines',
  PRODUCT = 'products',
  PAYMENT = 'payments',
  BOOKING = 'bookings',
  NOTE = 'notes',
}
export enum PaymentType {
  RECEIPT = 0,
  EXPENSE,
  PREPAID,
}

export const NOTE_ID = 'Note_Id';

export const PROVINCES = [
  'Cục Cảnh sát',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
  'Phú Yên',
  'Cần Thơ',
  'Đà Nẵng',
  'Hải Phòng',
  'Hà Nội',
  'TP Hồ Chí Minh',
];
