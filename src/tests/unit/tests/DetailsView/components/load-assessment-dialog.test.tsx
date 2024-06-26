// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog } from '@fluentui/react';
import { render } from '@testing-library/react';
import { PersistedTabInfo } from 'common/types/store-data/assessment-result-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { UrlParser } from 'common/url-parser';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    LoadAssessmentDialog,
    LoadAssessmentDialogProps,
} from 'DetailsView/components/load-assessment-dialog';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { ChangeAssessmentDialog } from '../../../../../DetailsView/components/change-assessment-dialog';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../DetailsView/components/change-assessment-dialog');
jest.mock('@fluentui/react');

describe('LoadAssessmentDialog', () => {
    mockReactComponents([ChangeAssessmentDialog, Dialog]);
    let urlParserMock: IMock<UrlParser>;
    let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;
    let loadAssessmentDialogProps: LoadAssessmentDialogProps;
    let prevTab: PersistedTabInfo;

    beforeEach(() => {
        urlParserMock = Mock.ofType(UrlParser, MockBehavior.Strict);
        assessmentActionMessageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);
        prevTab = {
            id: 111,
            url: 'https://www.test.com',
            title: 'test title',
        } as PersistedTabInfo;

        loadAssessmentDialogProps = {
            deps: {
                urlParser: urlParserMock.object,
                getAssessmentActionMessageCreator: () => assessmentActionMessageCreatorMock.object,
                detailsViewId: undefined,
            },
            prevTab: prevTab,
            tabId: 5,
            loadedAssessmentData: {} as VersionedAssessmentData,
            onClose: () => {},
            isOpen: true,
        };
    });

    test.each([null, undefined, {} as PersistedTabInfo])(
        'should render null when prevTab does not exist',
        prevTab => {
            const newTab = {
                id: 111,
                url: 'https://www.def.com',
                title: 'test title',
            };

            urlParserMock
                .setup(urlParserObject => urlParserObject.areURLsEqual(It.isAny(), newTab.url))
                .returns(() => true)
                .verifiable(Times.never());

            loadAssessmentDialogProps.prevTab = prevTab;

            render(<LoadAssessmentDialog {...loadAssessmentDialogProps} />);

            expect(getMockComponentClassPropsForCall(Dialog)).toBeFalsy();
            urlParserMock.verifyAll();
        },
    );

    it('should show when isOpen is set to true', () => {
        const renderResult = render(<LoadAssessmentDialog {...loadAssessmentDialogProps} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ChangeAssessmentDialog]);
    });

    it('should not show when isOpen is set to false', () => {
        loadAssessmentDialogProps.isOpen = false;
        const renderResult = render(<LoadAssessmentDialog {...loadAssessmentDialogProps} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ChangeAssessmentDialog]);
    });
});
