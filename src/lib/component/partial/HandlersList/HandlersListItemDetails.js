import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { Code, CodeHighlight } from "/lib/component/base";
import { Maybe, NamespaceLink } from "/lib/component/util";

const HandlersListItemDetails = ({ handler }) => (
  <React.Fragment>
    <div>
      {`Type: `}
      <strong>{handler.type}</strong>
    </div>

    <Maybe value={handler.type === "pipe"}>
      {() => (
        <React.Fragment>
          {`Command: `}
          <CodeHighlight
            language="bash"
            code={handler.command}
            component={Code}
          />
        </React.Fragment>
      )}
    </Maybe>

    <Maybe value={handler.type === "set"}>
      {() => (
        <React.Fragment>
          {`Handlers: [ `}
          {handler.handlers.map((hd, idx, arr) => (
            <React.Fragment key={hd.name}>
              <NamespaceLink
                namespace={hd.namespace}
                to={`/handlers/${hd.name}`}
              >
                <CodeHighlight
                  language="json"
                  code={`${hd.name}`}
                  component={Code}
                />
              </NamespaceLink>
              {idx < arr.length - 1 ? ", " : ""}
            </React.Fragment>
          ))}
          {` ]`}
        </React.Fragment>
      )}
    </Maybe>

    <Maybe value={handler.type === "tcp" || handler.type === "udp"}>
      {() => (
        <React.Fragment>
          {`Socket: `}
          <CodeHighlight
            language="json"
            code={`${handler.type}://${handler.socket.host}:${
              handler.socket.port
            }`}
            component={Code}
          />
        </React.Fragment>
      )}
    </Maybe>
  </React.Fragment>
);

HandlersListItemDetails.propTypes = {
  handler: PropTypes.object.isRequired,
};

HandlersListItemDetails.fragments = {
  handler: gql`
    fragment HandlersListItemDetails_handler on Handler {
      type
      command
      handlers {
        name
      }
      socket {
        port
        host
      }
    }
  `,
};

export default HandlersListItemDetails;
