import { DisplayRichText, ContentIterator, ContentItem, ContentType, ContentSwitch } from '@invisible-cms/react'
import React, { CSSProperties, ReactNode } from 'react';

interface BoxProps extends CSSProperties {
  children?: ReactNode
}

const Box = ({ children, ...style }: BoxProps) => (
  <div style={{ height: '2rem', margin: '0.5rem', ...style }}>{children}</div>
)

const Home = () => (
  <>
    <div>
      <h2>Content Iterator</h2>
      <ContentIterator dataRef="content">
        <ContentItem type={ContentType.rich()}>
          <Box>Hello</Box>
        </ContentItem>
      </ContentIterator>
    </div>

    <div>
      <h2>Content Switch</h2>
      <ContentIterator dataRef="contentSwitch">
        <ContentSwitch>
          <ContentItem type={ContentType.tagged({ tag: 'red' })}>
            <Box backgroundColor="red" />
          </ContentItem>

          <ContentItem type={ContentType.tagged({ tag: 'green' })}>
            <Box backgroundColor="green" />
          </ContentItem>
        </ContentSwitch>
      </ContentIterator>
    </div>

    <div>
      <h2>Rich</h2>
      <ContentItem dataRef="rich">
        <DisplayRichText />
      </ContentItem>
    </div>
  </>
)

export default Home
