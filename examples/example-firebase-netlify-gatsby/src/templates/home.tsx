import { DisplayRichText, ContentItem, DisplayImage } from '@invisible-cms/react'
import React, { CSSProperties, ReactNode } from 'react';

interface BoxProps extends CSSProperties {
  children?: ReactNode
}

const Box = ({ children, ...style }: BoxProps) => (
  <div style={{ height: '2rem', margin: '0.5rem', ...style }}>{children}</div>
)

const Home = () => (
  <>
    <section>
      <h2>Rich</h2>
      <ContentItem dataRef="richText">
        <DisplayRichText />
      </ContentItem>
    </section>

    <section>
      <h2>Image</h2>
      <ContentItem dataRef="image">
        <DisplayImage style={{ display: 'block', width: 300, height: 300, boxShadow: '0px 1px 5px rgba(0,0,0,0.3)' }} />
      </ContentItem>
    </section>
  </>
)

export default Home
