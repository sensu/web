import withWidth from "/vendor/@material-ui/core/withWidth";

export default withWidth()(({ width, children }) => children({ width }));
