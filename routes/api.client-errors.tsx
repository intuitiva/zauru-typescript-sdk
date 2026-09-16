import { createClientErrorsAction } from "@zauru-sdk/utils/cloudwatch.server";

/**
 * POST /api/client-errors
 *
 * More specific than `app/routes/api/$.tsx`, so it wins the splat.
 * Session is optional. Do not wrap with requireAppAccess.
 */
export const action = createClientErrorsAction();
