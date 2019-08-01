import { DisplayRichText, ContentItem, DisplayImage } from '@invisible-cms/react'
import React, { CSSProperties, ReactNode } from 'react';

interface BoxProps extends CSSProperties {
  children?: ReactNode
}

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
