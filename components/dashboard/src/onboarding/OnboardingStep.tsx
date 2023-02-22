/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { User } from "@gitpod/gitpod-protocol";
import { FC, FormEvent, useCallback } from "react";
import Alert from "../components/Alert";
import { useUpdateCurrentUserMutation } from "../data/current-user/update-mutation";

type Props = {
    title: string;
    subtitle: string;
    isValid: boolean;
    onUpdated(user: User): void;
    prepareUpdates(): Partial<User>;
};
export const OnboardingStep: FC<Props> = ({ title, subtitle, isValid, children, prepareUpdates, onUpdated }) => {
    const updateUser = useUpdateCurrentUserMutation();

    const handleSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const updates = prepareUpdates();
            try {
                const updatedUser = await updateUser.mutateAsync(updates);
                onUpdated(updatedUser);
            } catch (e) {
                console.error(e);
            }
        },
        [onUpdated, prepareUpdates, updateUser],
    );

    return (
        // flex classes here to account for an upcoming image on the right
        <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="max-w-full md:min-w-max">
                <h3>{title}</h3>
                <p>{subtitle}</p>

                <form onSubmit={handleSubmit} className="max-w-md">
                    {/* Form contents provided as children */}
                    {children}

                    {updateUser.isError && <Alert type="error">There was a problem updating your profile</Alert>}

                    <div>
                        <button disabled={!isValid || updateUser.isLoading} className="w-full mt-8">
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
