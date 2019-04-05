const componentWithMDXScope = require("gatsby-mdx/component-with-mdx-scope");
const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);

function onCreateNode({ node, getNode, actions }) {
  const { createNodeField } = actions;
  if (node.internal.type === "Mdx") {
    const relativeFilePath = createFilePath({
      node,
      getNode,
      basePath: "posts/"
    });
    createNodeField({
      node,
      name: "slug",
      value: `/posts${relativeFilePath}`
    });
  }
}

function createPages({ graphql, actions }) {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMdx {
              edges {
                node {
                  id
                  tableOfContents
                  code {
                    scope
                  }
                  parent {
                    ... on File {
                      absolutePath
                      name
                      sourceInstanceName
                    }
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create blog posts pages.
        result.data.allMdx.edges.forEach(({ node }) => {
          createPage({
            path: `/${node.parent.sourceInstanceName}/${node.parent.name}`,
            component: componentWithMDXScope(
              path.resolve("./src/components/layout.js"),
              node.code.scope,
              __dirname
            ),
            context: {
              absPath: node.parent.absolutePath,
              tableOfContents: node.tableOfContents,
              id: node.id
            }
          });
        });
      })
    );
  });
}

module.exports = { createPages, onCreateNode };

// exports.createPages = ({ graphql, actions }) => {
//   const { createPage } = actions;
//   return new Promise((resolve, reject) => {
//     resolve(
//       graphql(
//         `
//           {
//             allMdx {
//               edges {
//                 node {
//                   fields {
//                     id
//                   }
//                   tableOfContents
//                   fields {
//                     slug
//                   }
//                   code {
//                     scope
//                   }
//                 }
//               }
//             }
//           }
//         `
//       ).then(result => {
//         if (result.errors) {
//           console.log(result.errors); // eslint-disable-line no-console
//           reject(result.errors);
//         }

//         // Create blog posts pages.
//         result.data.allMdx.edges.forEach(({ node }) => {
//           createPage({
//             path: node.fields.slug ? node.fields.slug : "/",
//             component: componentWithMDXScope(
//               path.resolve("./src/templates/docs.js"),
//               node.code.scope
//             ),
//             context: {
//               id: node.fields.id
//             }
//           });
//         });
//       })
//     );
//   });
// };
