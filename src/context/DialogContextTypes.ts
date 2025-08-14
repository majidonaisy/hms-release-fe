import { createContext } from "react";
import { AddRoomTypeRequest } from "@/validation/schemas/RoomType";
import { AddRoleRequest } from "@/validation/schemas/Roles";
import { ExchangeRateRequest } from "@/validation/schemas/ExchangeRates";

export type DialogType = "roomType" | "amenity" | "ratePlan" | "role" | "delete" | "exchangeRate" | "departments" | "area" | null;

// Define proper types for dialog props
export type RoomTypeDialogProps = {
  onConfirm: (data: AddRoomTypeRequest) => Promise<void>;
};

export type AmenityDialogProps = {
  onAmenityAdded: () => Promise<void>;
};

export type RatePlanDialogProps = {
  onRatePlanAdded: () => Promise<void>;
};

export type RoleDialogProps = {
  onConfirm: (data: AddRoleRequest) => Promise<boolean>;
};

export type ExchangeRateProps = {
  onConfirm: (data: ExchangeRateRequest) => Promise<boolean>;
};

export type DepartmentDialogProps = {
  onConfirm: (data: string) => Promise<boolean>;
};

export type AreaDialogProps = {
  onConfirm: (data: string) => Promise<boolean>;
};

export type DeleteDialogProps = {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
};

// Union type of all possible dialog props
export type DialogProps = RoomTypeDialogProps | AmenityDialogProps | RatePlanDialogProps | RoleDialogProps | DeleteDialogProps | ExchangeRateProps | DepartmentDialogProps | AreaDialogProps | Record<string, unknown>;

export interface DialogContextType {
  isOpen: boolean;
  dialogType: DialogType;
  dialogProps: DialogProps;
  openDialog: (type: DialogType, props?: DialogProps) => void;
  closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextType | undefined>(undefined);
