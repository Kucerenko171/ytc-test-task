import {z} from "zod";

export const userSchema = z.object({
    users: z.array(z.object({
        id: z.number(),
        username: z.string().min(1, "Username is required"),
        email: z.string().min(1, "Email is required").email("Invalid email")
    }))
});

export type UserFormSchema = z.infer<typeof userSchema>;
