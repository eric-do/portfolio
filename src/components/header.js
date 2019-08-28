import React from "react"
import PropTypes from "prop-types"
import { rhythm, scale } from "../utils/typography"
import { Link } from "gatsby"
import { siteMetadata } from "../../gatsby-config"

const Header = ({ isRoot, title }) => {
  return (
    <header>
      {
        <h1 style={style.header}>
          <div style={style.titleContainer}>
          <Link style={style.link} to={`/`}>
            {siteMetadata.title}
          </Link>
          </div>

          <div style={style.sectionContainer}>
          <Link style={style.link} to={`/`}>
            {"Blog"}
          </Link>

          <Link style={style.link} to={`/projects`}>
            {"Projects"}
          </Link>
          </div>
        </h1>
      }
    </header>
  )
}

const style = {
  header: {
    ...scale(1.3),
    marginBottom: rhythm(1.5),
    marginTop: 0,
    display: 'flex'
  },
  notRoot: {
    fontFamily: `Montserrat, sans-serif`,
    marginTop: 0,
  },
  titleContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: '50%'
  },
  sectionContainer: {
    display: "flex",
    justifyContent: "flex-end",
    width: '50%'
  },
  link: {
    boxShadow: `none`,
    textDecoration: `none`,
    color: `inherit`,
  },
}

Header.defaultProps = {
  isRoot: false,
  title: "Default title",
  description: "Default desription",
}

Header.propTypes = {
  isRoot: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
}

export default Header
