const mdxFeed = require("gatsby-mdx/feed");

module.exports = {
  siteMetadata: {
    title: "Gatsby Playground - mizchi",
    siteUrl: "mizchi.me",
    description: "blog"
  },
  plugins: [
    {
      resolve: `gatsby-mdx`,
      options: {
        extensions: [".mdx", ".md"],
        defaultLayout: require.resolve("./src/components/layout.js"),
        mdPlugins: [require("remark-toc"), require("remark-breaks")]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/posts/`
      }
    },
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-feed`,
      options: mdxFeed
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui"
        // icon: "src/images/gatsby-icon.png" // This path is relative to the root of the site.
      }
    },
    "gatsby-plugin-offline"
  ]
};
