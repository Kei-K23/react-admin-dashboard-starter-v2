import { createMutationHook } from "../../../hooks/use-mutation-factory";
import { createQueryHook } from "../../../hooks/use-query-factory";
import {
  emailConfigService,
  type GetEmailConfigResponse,
} from "../services/email-config.service";

export const useGetEmailConfig = createQueryHook<GetEmailConfigResponse>(
  ["settings", "smtp"],
  emailConfigService.getEmailConfig as never
);

export const useCreateOrUpdateEmailConfig = createMutationHook(
  emailConfigService.createOrUpdateEmailConfig,
  {
    invalidateQueries: [["settings", "smtp"]],
  }
);
