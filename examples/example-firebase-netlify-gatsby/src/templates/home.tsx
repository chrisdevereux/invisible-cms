import { DisplayRichText, ContentItem, ContentType } from '@invisible-cms/react'
import React from 'react';

const Home = () => (
  <>
    <ContentItem id="name" type={ContentType.title()}>
      <DisplayRichText />
    </ContentItem>
  </>
)

export default Home
