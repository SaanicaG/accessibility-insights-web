// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { fireEvent, render } from '@testing-library/react';
import { VisualizationToggle } from 'common/components/visualization-toggle';
import {
    StaticContentDetailsView,
    StaticContentDetailsViewDeps,
    StaticContentDetailsViewProps,
} from 'DetailsView/components/static-content-details-view';
import * as React from 'react';
import { BaseDataBuilder } from 'tests/unit/common/base-data-builder';
import { EventStubFactory, NativeEventStub } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';
import { ContentInclude } from 'views/content/content-include';
import { ContentLink } from 'views/content/content-link';
import { ContentReference } from 'views/content/content-page';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('views/content/content-include');
jest.mock('views/content/content-link');

describe('StaticContentDetailsViewTest', () => {
    mockReactComponents([ContentInclude, ContentLink]);

    it('renders content page component', () => {
        const props = new StaticContentDetailsViewPropsBuilder().build();

        const renderResult = render(<StaticContentDetailsView {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('click the toggle', () => {
        const clickHandlerMock = Mock.ofInstance(theEvent => {});
        clickHandlerMock.setup(chm => chm(It.isAny())).verifiable(Times.once());

        const propsBuilder = new StaticContentDetailsViewPropsBuilder().setupOnToggleClickMock(
            It.isAny(),
        );
        const props: StaticContentDetailsViewProps = propsBuilder.build();
        const renderResult = render(<StaticContentDetailsView {...props} />);
        const onClick = renderResult.getByRole('switch');
        fireEvent.click(onClick);
        propsBuilder.verifyAll();
    });
});

class StaticContentDetailsViewPropsBuilder extends BaseDataBuilder<StaticContentDetailsViewProps> {
    private onToggleClickMock: IMock<(event) => void> = Mock.ofInstance(event => {});

    constructor() {
        super();

        this.data = {
            deps: 'stub-deps' as unknown as StaticContentDetailsViewDeps,
            title: 'my test title',
            visualizationEnabled: true,
            toggleLabel: 'my test toggle label',
            onToggleClick: this.onToggleClickMock.object,
            content: 'stub-content' as unknown as ContentReference,
            guidance: 'stub-guidance' as unknown as ContentReference,
            stepsText: 'test steps text',
        } as StaticContentDetailsViewProps;
    }

    public setupOnToggleClickMock(event: NativeEventStub): StaticContentDetailsViewPropsBuilder {
        this.onToggleClickMock.setup(click => click(It.isAny())).verifiable(Times.once());

        return this;
    }

    public verifyAll(): void {
        this.onToggleClickMock.verifyAll();
    }
}
