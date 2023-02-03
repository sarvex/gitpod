/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { GitIntegrations } from "./git-integrations/GitIntegrations";
import { TeamSettingsPage } from "./TeamSettingsPage";

export default function GitAuth() {
    return (
        <TeamSettingsPage
            title="Git Integrations"
            subtitle="Setup Git Integrations for your organization."
            restrictToOwner
        >
            <GitIntegrations />
        </TeamSettingsPage>
    );
}
