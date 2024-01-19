// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { GuidanceTags } from 'common/components/guidance-tags';
import {
    getRequirementViewTitleForAssessment,
    getRequirementViewTitleForQuickAssess,
    RequirementViewTitleDeps,
    RequirementViewTitleFactoryProps,
} from 'DetailsView/components/requirement-view-title-factory';
import { ContentPageComponent } from 'views/content/content-page';
import { ContentPanelButton } from 'views/content/content-panel-button';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('views/content/content-panel-button');
jest.mock('common/components/guidance-tags');

describe('RequirementViewTitleFactoryTest', () => {
    let props: RequirementViewTitleFactoryProps;
    beforeEach(() => {
        mockReactComponents([ContentPanelButton, GuidanceTags]);
        props = {
            deps: {} as RequirementViewTitleDeps,
            assessmentKey: 'test-assessment-key',
            name: 'test-requirement-name',
            guidanceLinks: [{ href: 'test-guidance-href', text: 'test-guidance-text' }],
            infoAndExamples: { pageTitle: 'test-page-title' } as ContentPageComponent,
        };
    });

    describe('getRequirementViewTitleForAssessment', () => {
        it('renders content from props', () => {
            const renderResult = render(getRequirementViewTitleForAssessment(props));
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([GuidanceTags]);
            expectMockedComponentPropsToMatchSnapshots([ContentPanelButton]);
        });

        it('renders content with info button and guidance tags', () => {
            render(getRequirementViewTitleForAssessment(props));

            expect(getMockComponentClassPropsForCall(GuidanceTags).links).toBe(props.guidanceLinks);

            expect(getMockComponentClassPropsForCall(ContentPanelButton).reference).toBe(
                props.infoAndExamples,
            );
        });
    });

    describe('getRequirementViewTitleForQuickAssess', () => {
        it('renders content from props', () => {
            const renderResult = render(getRequirementViewTitleForQuickAssess(props));
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('renders content without info button and guidance tags', () => {
            const renderResult = render(getRequirementViewTitleForQuickAssess(props));

            const mockguidancetags = renderResult.container.querySelector('mock-guidancetags');
            expect(mockguidancetags).toBeNull();

            const mockcontrolpanel = renderResult.container.querySelector('mock-controlpanel');
            expect(mockcontrolpanel).toBeNull();
        });

        it('does render info button and guidance tags for automated checks', () => {
            props.assessmentKey = AutomatedChecks.key;
            render(getRequirementViewTitleForQuickAssess(props));

            expect(getMockComponentClassPropsForCall(GuidanceTags).links).toBe(props.guidanceLinks);
            expect(getMockComponentClassPropsForCall(ContentPanelButton).reference).toBe(
                props.infoAndExamples,
            );
        });
    });
});
