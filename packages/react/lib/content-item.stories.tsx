import { storiesOf } from "@storybook/react";
import { ContentIterator, ContentItem, ContentSwitch } from "./content-item";
import React from "react";
import { ContentType } from "./content";
import { DisplayRichText } from "./display-rich";

storiesOf('react/ContentItem', module)
  .add('list', () => (
    <ContentIterator dataRef="items">
      <ContentItem type={ContentType.rich()}>
        <p>
          Hello
        </p>
      </ContentItem>
    </ContentIterator>
  ))
  .add('variant list', () => (
    <ContentIterator dataRef="contentSwitch">
      <ContentSwitch>
        <ContentItem type={ContentType.tagged({ tag: 'red' })}>
          <div style={{ height: '2rem', margin: '0.5rem', backgroundColor: 'red' }} />
        </ContentItem>

        <ContentItem type={ContentType.tagged({ tag: 'green' })}>
          <div style={{ height: '2rem', margin: '0.5rem', backgroundColor: 'green' }} />
        </ContentItem>
      </ContentSwitch>
    </ContentIterator>
  ))
  .add('rich', () => (
    <ContentItem dataRef="rich">
      <DisplayRichText />
    </ContentItem>
  ))