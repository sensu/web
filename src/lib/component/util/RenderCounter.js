import React from "/vendor/react";

class RenderCounter extends React.Component {
  count = 0;

  render() {
    const count = this.count;
    this.count = count + 1;
    return count;
  }
}

export default RenderCounter;
