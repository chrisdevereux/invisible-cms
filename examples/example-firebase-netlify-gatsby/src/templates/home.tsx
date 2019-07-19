import { Content, Editable } from '@invisiblecms/react'
import React from 'react';

const Home = () => (
  <Editable id="name" initialValue="NAME">
    <Content />
  </Editable>
)

export default Home
