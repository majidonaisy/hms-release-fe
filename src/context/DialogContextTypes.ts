import { createContext } from "react";
import { AddRoomTypeRequest } from "@/validation/schemas/RoomType";
import { AddRoleRequest } from "@/validation/schemas/Roles";

export type DialogType = "roomType" | "amenity" | "ratePlan" | "role" | "delete" | null;

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

export type DeleteDialogProps = {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
};

// Union type of all possible dialog props
export type DialogProps = RoomTypeDialogProps | AmenityDialogProps | RatePlanDialogProps | RoleDialogProps | DeleteDialogProps | Record<string, unknown>;

export interface DialogContextType {
  isOpen: boolean;
  dialogType: DialogType;
  dialogProps: DialogProps;
  openDialog: (type: DialogType, props?: DialogProps) => void;
  closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextType | undefined>(undefined);
