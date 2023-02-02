/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { TeamMemberInfo } from "@gitpod/gitpod-protocol";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { publicApiTeamMembersToProtocol, teamsService } from "../../service/public-api";
import { useCurrentTeam } from "../../teams/teams-context";
import { useCurrentUser } from "../../user-context";

type UseOrganizationMembers = {
    organizationId: string;
};
type OrganizationMembersQueryResult = TeamMemberInfo[];

export const useOrganizationMembers = ({ organizationId }: UseOrganizationMembers) => {
    return useQuery<OrganizationMembersQueryResult>({
        queryKey: getOrganizationMembersQueryKey(organizationId),
        queryFn: async () => {
            const resp = await teamsService.getTeam({ teamId: organizationId });

            return publicApiTeamMembersToProtocol(resp.team?.members || []);
        },
    });
};

// Wrapper around useOrganizationMembers to get the current user's, current orgs member info record
export const useCurrentOrganizationMember = () => {
    const organization = useCurrentTeam();
    const user = useCurrentUser();

    const { data: members, isLoading } = useOrganizationMembers({ organizationId: organization?.id ?? "" });

    return useMemo(() => {
        let member: TeamMemberInfo | undefined;

        if (!isLoading && members && user) {
            member = members.find((m) => m.userId === user.id);
        }

        return { isLoading, member };
    }, [isLoading, members, user]);
};

export const getOrganizationMembersQueryKey = (organizationId: string) => [
    "organizations",
    { organizationId },
    "members",
];
