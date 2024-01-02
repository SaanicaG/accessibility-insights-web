// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { RuleResources, RuleResourcesDeps, RuleResourcesProps } from 'common/components/cards/rule-resources';
import { ExternalLink } from 'common/components/external-link';
import { NewTabLink } from 'common/components/new-tab-link';
import { GuidanceLink } from 'common/types/store-data/guidance-links';
import { GuidanceLinks } from 'common/components/guidance-links';//manually added
import { cloneDeep } from 'lodash';
import * as React from 'react';
import {                                            //manually added
    getMockComponentClassPropsForCall,   //manually added
    mockReactComponents,                    //manually added
} from 'tests/unit/mock-helpers/mock-module-helpers';   //manually added

import { exampleUnifiedRuleResult } from './sample-view-model-data';
import {GuidanceTags} from  'common/components/guidance-tags';

jest.mock('common/components/guidance-tags');  //manually added
jest.mock('common/components/guidance-links');// manually added
describe('RuleResources', () => {
    mockReactComponents([GuidanceTags,GuidanceLinks]); //manually added
    describe('renders', () => {
        const linkComponents = {
            NewTabLink,
            ExternalLink,
        };

        type TestCases = {
            url: string;
            guidanceLinks: GuidanceLink[];
            linkComponent: keyof typeof linkComponents;
        };

        const testCases: TestCases[] = [
            {
                url: 'test-url',
                guidanceLinks: [{ href: 'test-href' } as GuidanceLink],
                linkComponent: 'ExternalLink',
            },
            {
                url: null,
                guidanceLinks: [{ href: 'test-href' } as GuidanceLink],
                linkComponent: 'NewTabLink',
            },
            { url: 'test-url', guidanceLinks: [], linkComponent: 'ExternalLink' },
            { url: 'test-url', guidanceLinks: null, linkComponent: 'NewTabLink' },
            { url: null, guidanceLinks: [], linkComponent: 'ExternalLink' },
            { url: null, guidanceLinks: null, linkComponent: 'NewTabLink' },
        ];

        it.each(testCases)('with %o', testCase => {
            const rule = cloneDeep(exampleUnifiedRuleResult);
            rule.url = testCase.url;
            rule.guidance = testCase.guidanceLinks;

            const props: RuleResourcesProps = {
                rule,
                deps: {
                    LinkComponent: linkComponents[testCase.linkComponent],
                } as RuleResourcesDeps,
            };

            const renderResult = render(<RuleResources {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
