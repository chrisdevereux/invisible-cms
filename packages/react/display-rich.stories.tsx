import React from 'react'
import { storiesOf } from "@storybook/react";
import { ContentItem } from './content-item';
import { DisplayRichText } from './display-rich';
import { ContentType } from './content';

storiesOf('invisible-cms/DisplayRich', module)
  .add('standard', () => (
    <ContentItem id="value" type={ContentType.title}>
      <DisplayRichText />
    </ContentItem>
  ))