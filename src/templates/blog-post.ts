import { FC, createElement as h } from "react"
import { Link, graphql } from "gatsby"
import Bio from '../components/bio'
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"

interface Props {
  data: any
  location: Location
  pageContext: any
}

const BlogPostTemplate: FC<Props> = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext
  const { author } = post.frontmatter

  const authorName = (() => {
    if (author == null) return ""

    if (author.first) {
      return `${author.first} ${author.last || ""}`.trim()
    }
    return author.id
  })()

  return h(
    Layout,
    {
      location,
      title: siteTitle,
    },
    h(SEO, {
      title: post.frontmatter.title,
      description: post.frontmatter.description || post.excerpt,
    }),
    h(
      "article",
      null,
      h(
        "header",
        null,
        h(
          "h1",
          {
            style: {
              marginTop: rhythm(1),
              marginBottom: 0,
            },
          },
          post.frontmatter.title
        ),
        // TODO: look up author email from an author bio
        authorName && h("h3", null, `by ${authorName}`),
        h(
          "p",
          {
            style: {
              ...scale(-1 / 5),
              display: `block`,
              marginBottom: rhythm(1),
            },
          },
          post.frontmatter.date
        )
      ),
      h("section", {
        dangerouslySetInnerHTML: {
          __html: post.html,
        },
      }),
      h("hr", {
        style: {
          marginBottom: rhythm(1),
        },
      }),
      h(
        "footer",
        null,
        h(Bio, {
          name: authorName,
          email: author.id,
          bio: author.bio,
          avatar: author.avatar,
        })
      )
    ),
    h(
      "nav",
      null,
      h(
        "ul",
        {
          style: {
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          },
        },
        h(
          "li",
          null,
          previous &&
            h(
              Link,
              {
                to: previous.fields.slug,
                rel: "prev",
              },
              "\u2190 ",
              previous.frontmatter.title
            )
        ),
        h(
          "li",
          null,
          next &&
            h(
              Link,
              {
                to: next.fields.slug,
                rel: "next",
              },
              next.frontmatter.title,
              " \u2192"
            )
        )
      )
    )
  )
}

export default BlogPostTemplate
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        author {
          id
          first
          last
        }
        tags
      }
    }
  }
`
