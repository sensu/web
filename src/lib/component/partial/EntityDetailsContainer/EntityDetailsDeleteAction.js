import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { compose } from "recompose";
import { withApollo } from "/vendor/react-apollo";
import { withRouter } from "/vendor/react-router-dom";

import deleteEntity from "/lib/mutation/deleteEntity";

import ConfirmDelete from "/lib/component/partial/ConfirmDelete";

class EntityDetailsDeleteAction extends React.PureComponent {
  static propTypes = {
    client: PropTypes.object.isRequired,
    entity: PropTypes.object,
    history: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entity: null,
  };

  static fragments = {
    entity: gql`
      fragment EntityDetailsDeleteAction_entity on Entity {
        id
        name
        namespace
      }
    `,
  };

  deleteRecord = () => {
    const { client, entity } = this.props;
    const { id, namespace } = entity;

    // delete
    deleteEntity(client, { id });

    // optimistically redirect
    this.props.history.push(`/${namespace}/entities`);
  };

  render() {
    return (
      <ConfirmDelete
        identifier={this.props.entity.name}
        onSubmit={this.deleteRecord}
      >
        {dialog => this.props.children(dialog.open)}
      </ConfirmDelete>
    );
  }
}

const enhancer = compose(
  withRouter,
  withApollo,
);
export default enhancer(EntityDetailsDeleteAction);
