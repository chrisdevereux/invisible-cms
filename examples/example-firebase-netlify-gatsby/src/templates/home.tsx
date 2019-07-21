import { DisplayRichText, ContentItem, ContentType, DisplayList } from '@invisible-cms/react'
import React from 'react';

const Home = () => (
  <>
  <DisplayList itemType={ContentType.title()}>
    <DisplayRichText />
  </DisplayList>
  </>
)

export default Home
