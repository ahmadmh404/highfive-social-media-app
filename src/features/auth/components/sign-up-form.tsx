"use client";

import { FormBuilder } from "@/components/builders/form/form-builder";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/features/auth/actions/schemas";
import z from "zod";
import { BackButtonConfig, FormStep } from "@/components/builders/form/types";
import { toast } from "sonner";
import { AVATAR_PLACEHOLDER, UserTypeSelectOptions } from "@/data/constants";
import { SignUpSchemaType } from "@/features/auth/types";
import { enums } from "@/data/enums";
import { Globe, Lock } from "lucide-react";
import { register } from "../actions/actions";

export function SignInForm({
  categories,
  from_user_id,
}: {
  categories: string[];
  from_user_id?: string;
}) {
  const steps: FormStep<SignUpSchemaType>[] = [
    {
      id: "account_type",
      title: "Account Type",
      description: "Choose your account type",
      fields: [
        {
          id: "user_type",
          name: "user_type",
          label: "Account Type",
          type: "select",
          defaultValue: enums.USER_TYPES[0],
          options: UserTypeSelectOptions,
          className: "w-full",
        },
      ],
    },
    {
      id: "basic_info",
      title: "Basic Information",
      fields: [
        {
          id: "name",
          label: "Full Name",
          name: "name",
          type: "text",
          placeholder: "John Doe",
        },
        {
          id: "email",
          label: "Email Address",
          name: "email",
          type: "email",
          placeholder: "john@doe.xyz",
        },
        {
          id: "username",
          label: "Username",
          name: "username",
          type: "text",
          placeholder: "john236",
        },
      ],
    },
    {
      id: "dob_bio",
      title: "Basic Information",
      fields: [
        {
          id: "date_of_birth",
          name: "dob",
          label: "Date Of Birth",
          type: "date",
          placeholder: "2-2-2002",
          conditional: {
            field: "user_type",
            operator: "equals",
            value: "user",
          },
        },
        {
          id: "bio",
          name: "bio",
          label: "Bio",
          type: "textarea",
          placeholder: "WRite a short bio..",
        },
      ],
    },
    {
      id: "contact_categories",
      title: "Additional Info",
      fields: [
        {
          id: "phone",
          name: "phone",
          label: "Phone Number",
          type: "text",
          conditional: {
            field: "user_type",
            operator: "equals",
            value: "user",
          },
        },
        {
          id: "location",
          name: "location",
          label: "Location",
          type: "text",
          conditional: {
            field: "user_type",
            operator: "equals",
            value: "user",
          },
        },
        {
          id: "website",
          name: "website",
          label: "Website",
          type: "url",
          conditional: {
            field: "user_type",
            operator: "equals",
            value: "user",
          },
        },
        {
          id: "categories",
          name: "categories",
          label: "Account Content",
          type: "multiselect",
          options: categories.map((cat) => ({ value: cat, label: cat })),
          conditional: {
            field: "user_type",
            operator: "not-equals",
            value: "user",
          },
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      fields: [
        {
          id: "password",
          name: "password",
          label: "Password",
          type: "password",
          conditional: {
            field: "user_type",
            operator: "equals",
            value: "user",
          },
        },
        {
          id: "Confirm Password",
          name: "password_confirmation",
          label: "Confirm Password",
          type: "password",
          conditional: {
            field: "user_type",
            operator: "equals",
            value: "user",
          },
        },
        {
          id: "security",
          name: "security",
          label: "Privacy",
          type: "radio",
          options: enums.ACCOUNT_PRIVACY.map((privacy) => ({
            value: privacy,
            label: privacy,
            description:
              privacy === "private"
                ? "People can find you by invitation"
                : "People anywhere can find you",
            icon: privacy === "private" ? Lock : Globe,
          })),

          conditional: {
            field: "user_type",
            operator: "not-equals",
            value: "user",
          },
        },
      ],
    },
    {
      id: "publish_contact_info",
      title: "Contact Information",
      fields: [
        {
          id: "phone",
          name: "phone",
          label: "Phone Number",
          type: "text",
          conditional: {
            field: "user_type",
            operator: "not-equals",
            value: "user",
          },
        },
        {
          id: "location",
          name: "location",
          label: "Location",
          type: "text",
          conditional: {
            field: "user_type",
            operator: "not-equals",
            value: "user",
          },
        },
        {
          id: "website",
          name: "website",
          label: "Website",
          type: "url",
          conditional: {
            field: "user_type",
            operator: "not-equals",
            value: "user",
          },
        },
      ],
    },
    {
      id: "publish_security",
      title: "Security",
      fields: [
        {
          id: "password",
          name: "password",
          label: "Password",
          type: "password",
          conditional: {
            field: "user_type",
            operator: "not-equals",
            value: "user",
          },
        },
        {
          id: "Confirm Password",
          name: "password_confirmation",
          label: "Confirm Password",
          type: "password",
          conditional: {
            field: "user_type",
            operator: "not-equals",
            value: "user",
          },
        },
      ],
    },
  ];

  const backButtonConfig: BackButtonConfig = {
    backButtonHref: "/sign-in",
    backButtonLabel: "Already have an account? Login",
  };

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      user_type: "user",
      name: "",
      email: "",
      username: "",
      password: "",
      password_confirmation: "",
      avatar: AVATAR_PLACEHOLDER,
      categories: [],
      security: null,
      dob: new Date().toLocaleDateString(),
      sharable: "1",
      phone: "",
      location: "",
      bio: "",
      website: "",
      from_user_id: from_user_id ?? null,
    },
  });

  async function handleSubmit(data: z.infer<typeof SignupSchema>) {
    const response = await register(data);
    if (response.error) {
      toast.error(response.message);
    }
  }

  return (
    <div className="w-full space-y-5">
      <FormBuilder
        title="Sign Up"
        description="Create a new account"
        form={form}
        showStepProgress={false}
        onSubmit={handleSubmit}
        backButtonConfig={backButtonConfig}
        steps={steps}
      />
    </div>
  );
}
