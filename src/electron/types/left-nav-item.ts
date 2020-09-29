// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LeftNavItemKey } from 'electron/platform/android/types/left-nav-item-key';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export type LeftNavItem = {
    key: LeftNavItemKey;
    displayName: string;
    onSelect: () => void;
};