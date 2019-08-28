import React from "react";
import Header from './header';

import { rhythm } from "../utils/typography"

class Layout extends React.Component {
  render() {
    const { location, title, children, test } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
  
    return (
      <div>
        <Header isRoot={location.pathname === rootPath} title={title} test={test} />
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {/* <header>{header}</header> */}
        
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
      </div>
    )
  }
}

export default Layout
