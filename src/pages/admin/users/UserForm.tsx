import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { enumToOptions } from "../../../lib/select";
import { EUserRole, type IUser } from "../../../types/user.types";
import { Button } from "../../../components/buttons/Button";
import { INPUT } from "../../../components/input/Input";
import { smartToast } from "../../../lib/toast";
import { fireDoubleEscape } from "../../../hooks/Esc";
import { useUpdateAuthUserMutation } from "../../../store/api/user.api";
import { SELECT } from "../../../components/input/Select";

export default function UserForm({ user }: { user?: IUser }) {
  const [updateUser] = useUpdateAuthUserMutation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { ...user },
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      const result = await updateUser({
        _id: user?._id as string,
        role: data?.role,
      }).unwrap();

      smartToast(result);
      if (result.success) {
        fireDoubleEscape();
      }
    } catch (e) {
      smartToast({ error: e });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-8 pt-5">
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <INPUT
            label="Email"
            type="email"
            error={fieldState.error?.message}
            {...field}
            disabled
          />
        )}
      />

      <Controller
        control={control}
        name="role"
        render={({ field, fieldState }) => (
          <SELECT
            options={enumToOptions(EUserRole)}
            value={field.value}
            onChange={field.onChange}
            label={"Role"}
            error={fieldState.error?.message}
          />
        )}
      />

      <Button
        text={user ? "Update User" : "Create User"}
        isLoading={isSubmitting}
        loadingText={user ? "Updating..." : "Creating..."}
        type="submit"
        className="p-2 grow w-full justify-center"
      />
    </form>
  );
}

export const createUserSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.enum(EUserRole),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
