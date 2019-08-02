import React from 'react'
import { storiesOf } from "@storybook/react";
import { ContentItem } from '../content-item';
import { DisplayRichText } from './display-rich';
import { ContentType, ProvideContent } from '../content';
import { noop, withState } from '../util';

const customElements = {
  a: ({ href, children }) => (
    <a style={{ color: 'hotpink' }} href={'#' + href}>
      {children}
    </a>
  )
}

storiesOf('react/display/DisplayRich', module)
  .add('editable', () => (
    <ContentItem dataRef="value" type={ContentType.rich()}>
      <DisplayRichText />
    </ContentItem>
  ))
  .add('editable (custom link component)', withState({ __html: '<a href="/foo">hello</a>' },props => (
    <ProvideContent editable={true} {...props}>
      <DisplayRichText
        customElements={customElements}
      />
    </ProvideContent>
  )))
  .add('not editable', () => (
    <ContentItem editable={false} dataRef="value" type={ContentType.rich()}>
      <DisplayRichText />
    </ContentItem>
  ))
  .add('not editable (custom link component)', () => (
    <ProvideContent editable={false} value={{ __html: '<a href="/foo">hello</a>' }} onChange={noop}>
      <DisplayRichText
        customElements={customElements}
      />
    </ProvideContent>
  ))
