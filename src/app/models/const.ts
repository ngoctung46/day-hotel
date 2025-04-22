export enum RoomType {
  NORMAL = 'normal',
  AC = 'ac',
  VIP = 'vip',
}
export enum RoomStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  NEED_CLEANING = 'need_cleaning',
  UNDER_MAINTENANCE = 'under_maintenance',
}
export enum RoomRate {
  NORMAL = 200_000,
  DELUXE = 250_000,
  VIP = 300_000,
}

export enum CollectionName {
  ROOM = 'rooms',
}
