import React, { Fragment } from 'react'
import NavBar from './navbar'

const Layout = ({ children }) => (
  <Fragment>
    <main className="d-flex flex-column">
      <NavBar />
      {children}
    </main>
  </Fragment>
)

export default Layout
