import { generateReactHelpers } from "@uploadthing/react";
import { CustomFileRouter } from "./router";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<CustomFileRouter>();
