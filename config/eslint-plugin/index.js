"use-strict";

function findAncestor(node, test) {
  if (!node) {
    return null;
  }

  if (test(node)) {
    return node;
  }

  return findAncestor(node.parent, test);
}

module.exports = {
  rules: {
    "no-global-regex": {
      meta: {
        type: "problem",

        docs: {
          description: "disallow global flag on `RegExp` literals",
          category: "Possible Errors",
          recommended: true,
        },

        schema: [
          {
            type: "object",
            properties: {
              allowCallExpressions: {
                type: "boolean",
                default: false,
              },
              allowEphemeral: {
                type: "boolean",
                default: false,
              },
            },
            additionalProperties: false,
          },
        ],

        messages: {
          unexpected:
            "Unexpected global flag on regular expression: {{value}}.",
        },
      },

      create(context) {
        const [options = {}] = context.options;

        return {
          Literal(node) {
            if (!node.regex) {
              return;
            }

            if (!/g/.test(node.regex.flags)) {
              return;
            }

            if (
              options.allowCallExpressions &&
              node.parent.type === "CallExpression" &&
              node.parent.arguments.includes(node)
            ) {
              return;
            }

            if (options.allowEphemeral) {
              const ancestor = findAncestor(node, current => {
                // Exit if we have reached the root node
                if (!current.parent) {
                  return false;
                }

                // Exit if if the current node is a member of a sequence
                // expression and not the last member.
                if (
                  current.parent.type === "SequenceExpression" &&
                  current.parent.expressions[
                    current.parent.expressions.length - 1
                  ] !== current
                ) {
                  return true;
                }

                // Exit if the RegExp is a method callee.
                if (
                  current === node &&
                  current.parent.type === "CallExpression" &&
                  current.parent.callee === current
                ) {
                  return true;
                }

                // Check if the current node represents an assignment or
                // function return.
                return (
                  current.parent.type === "ReturnStatement" ||
                  current.parent.type === "VariableDeclarator" ||
                  current.parent.type === "AssignmentExpression"
                );
              });

              if (
                !ancestor ||
                ancestor.parent.type === "SequenceExpression" ||
                ancestor.parent.type === "CallExpression"
              ) {
                return;
              }
            }

            context.report({
              node,
              messageId: "unexpected",
              data: {
                value: node.value,
              },
            });
          },
        };
      },
    },
  },
};
