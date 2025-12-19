import { SelectOption } from "@/components/builders/select/select";

export const UserTypeSelectOptions: SelectOption[] = [
  {
    label: "Normal User",
    value: "user",
    description: "This will create a normal account",
  },
  {
    label: "Group",
    value: "group",
    description: "This will automatically create a  group with initials ",
  },
  {
    label: "Page",
    value: "page",
    description: "This will automatically create a page with initials ",
  },
];

export const AVATAR_PLACEHOLDER =
  "https://u6qav6wqrt.ufs.sh/f/tHd3nFI3vfFctKyMC0CI3vfFcDery69QqXxGJwEUg1SYbsMa";
