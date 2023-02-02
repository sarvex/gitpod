/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { AuthProviderEntry } from "@gitpod/gitpod-protocol";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getGitpodService } from "../../service/service";
import { getOrgAuthProvidersQueryKey } from "./org-auth-providers-query";

type UpdateAuthProviderArgs = {
    provider: AuthProviderEntry.NewOrgEntry | AuthProviderEntry.UpdateOrgEntry;
};
export const useUpsertOrgAuthProviderMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ provider }: UpdateAuthProviderArgs) => {
            if ("id" in provider) {
                return await getGitpodService().server.updateOrgAuthProvider({ entry: provider });
            } else {
                return await getGitpodService().server.createOrgAuthProvider({ entry: provider });
            }
        },
        onSuccess(provider) {
            if (!provider || !provider.organizationId) {
                return;
            }

            queryClient.invalidateQueries({ queryKey: getOrgAuthProvidersQueryKey(provider.organizationId) });
        },
    });
};
