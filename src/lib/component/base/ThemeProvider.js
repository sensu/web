import React from "/vendor/react";
import PropTypes from "prop-types";
import { MuiThemeProvider } from "/vendor/@material-ui/core";
import * as themes from "/lib/theme";

class ThemeProvider extends React.Component {
  static propTypes = {
    theme: PropTypes.string,
    dark: PropTypes.bool,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    theme: "sensu",
    dark: false,
  };

  componentWillMount() {
    let theme = themes[this.props.theme];
    if (!theme) {
      // eslint-disable-next-line no-console
      console.warn("unable to configured theme: ", this.props.theme);
      // eslint-disable-next-line no-console
      console.warn("falling back to default theme.");
      theme = "sensu";
    }

    const type = this.props.dark ? "dark" : "light";
    this.theme = theme(type);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.theme !== this.props.theme ||
      nextProps.dark !== this.props.dark
    ) {
      const type = nextProps.dark ? "dark" : "light";
      const theme = themes[nextProps.theme];
      this.theme = theme(type);
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={this.theme}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}

export default ThemeProvider;
