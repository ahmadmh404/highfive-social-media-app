import * as z from "zod";
import { SignupSchema } from "./actions/schemas";

export type SignUpSchemaType = z.infer<typeof SignupSchema>;
