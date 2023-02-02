/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { Team } from "@gitpod/gitpod-protocol";
import { BillingMode } from "@gitpod/gitpod-protocol/lib/billing-mode";
import { FunctionComponent, ReactNode, useMemo } from "react";
import { Redirect } from "react-router";
import Header from "../components/Header";
import { SpinnerLoader } from "../components/Loader";
import { PageWithSubMenu } from "../components/PageWithSubMenu";
import { useFeatureFlags } from "../contexts/FeatureFlagContext";
import { useOrgBillingMode } from "../data/billing-mode/org-billing-mode-query";
import { useCurrentOrganizationMember } from "../data/organizations/org-members-query";
import { useCurrentTeam } from "./teams-context";

type Props = {
    title: ReactNode;
    subtitle: ReactNode;
    restrictToOwner: boolean;
};
export const TeamSettingsPage: FunctionComponent<Props> = ({ title, subtitle, restrictToOwner, children }) => {
    const team = useCurrentTeam();
    const { data: billingMode, isLoading: isBillingModeLoading } = useOrgBillingMode();
    const { member, isLoading: isMemberInfoLoading } = useCurrentOrganizationMember();
    const { oidcServiceEnabled, orgGitAuthProviders } = useFeatureFlags();

    const isLoading = useMemo(
        () => isBillingModeLoading || isMemberInfoLoading,
        [isBillingModeLoading, isMemberInfoLoading],
    );

    const isOwner = useMemo(() => {
        return member?.role === "owner";
    }, [member?.role]);

    const subMenuItems = useMemo(() => {
        return getTeamSettingsMenu({
            team,
            billingMode,
            ssoEnabled: oidcServiceEnabled,
            orgGitAuthProviders,
        });
    }, [billingMode, oidcServiceEnabled, orgGitAuthProviders, team]);

    // Render as much of the page as we can in a loading state to avoid content shift
    if (isLoading) {
        return (
            <div className="w-full">
                <Header title={title} subtitle={subtitle} />
                <div className="w-full">
                    <SpinnerLoader />
                </div>
            </div>
        );
    }

    if (!isOwner) {
        return <Redirect to={"/"} />;
    }

    return (
        <PageWithSubMenu subMenu={subMenuItems} title={title} subtitle={subtitle}>
            {children}
        </PageWithSubMenu>
    );
};

export function getTeamSettingsMenu(params: {
    team?: Team;
    billingMode?: BillingMode;
    ssoEnabled?: boolean;
    orgGitAuthProviders: boolean;
}) {
    const { billingMode, ssoEnabled, orgGitAuthProviders } = params;
    const result = [
        {
            title: "General",
            link: [`/org-settings`],
        },
    ];
    if (orgGitAuthProviders) {
        result.push({
            title: "Git Integrations",
            // TODO: make this a better url
            link: [`/org-git-auth`],
        });
    }
    if (ssoEnabled) {
        result.push({
            title: "SSO",
            link: [`/sso`],
        });
    }
    if (billingMode?.mode !== "none") {
        // The Billing page contains both chargebee and usage-based components, so: always show them!
        result.push({
            title: "Billing",
            link: [`/org-billing`],
        });
    }
    return result;
}
