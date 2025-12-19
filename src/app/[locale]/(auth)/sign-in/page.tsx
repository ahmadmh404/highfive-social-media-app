"use client";

import { FormBuilder } from "@/components/builders/form/form-builder";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/features/auth/actions/schemas";
import z from "zod";
import { useSearchParams } from "next/navigation";
import { BackButtonConfig } from "@/components/builders/form/types";
import { login } from "@/features/auth/actions/actions";
import { toast } from "sonner";

export default function SignInPage() {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountLinked"
      ? "Email already in use with different provider!"
      : "";

  const backButtonConfig: BackButtonConfig = {
    backButtonHref: "/sign-up",
    backButtonLabel: "Don't have an account? Signup",
  };

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(data: z.infer<typeof LoginSchema>) {
    const response = await login(data, callbackUrl);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  }

  return (
    <div className="w-full space-y-5">
      <FormBuilder
        title="Login"
        description="Welcome back, login to your account"
        form={form}
        onSubmit={handleSubmit}
        loading={form.formState.isSubmitting}
        backButtonConfig={backButtonConfig}
        submitButtonProps={{ className: "w-full mt-6" }}
        message={
          urlError.trim() === "" ? undefined : { type: "error", text: urlError }
        }
        fields={[
          {
            id: "email",
            name: "email",
            label: "Email Address",
            type: "email",
            placeholder: "john@doe.xyz",
          },
          {
            id: "password",
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "a strong password",
          },
        ]}
      />
    </div>
  );
}
