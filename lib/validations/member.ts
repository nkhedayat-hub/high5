import { z } from "zod";
export const memberSchema = z.object({
  firstName: z.string().min(2, "نام الزامی است"), lastName: z.string().min(2, "نام خانوادگی الزامی است"), mobile: z.string().min(8), email: z.string().email().optional().or(z.literal("")), birthDate: z.string().optional(), address: z.string().optional(), job: z.string().optional(), referralSource: z.string().optional(), socialNetwork: z.string().optional(), medicalNotes: z.string().optional(), goal: z.string().optional(), referredByCode: z.string().optional()
});
export const planSchema = z.object({ title: z.string().min(2), disciplineId: z.string().min(1), sessionCount: z.coerce.number().refine((v) => [1,4,8,10,12].includes(v)), durationDays: z.coerce.number().min(1), price: z.coerce.number().min(0), isMixedClassAllowed: z.coerce.boolean().optional() });
