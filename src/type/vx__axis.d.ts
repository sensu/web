declare module "@vx/axis";

interface AxisBottom {
  top: number;
  left: number;
  scale<X>(_: X): number;

  numTicks: number;
  tickStroke: string;
  tickLabelProps(): object;

  stroke: string;
  strokeWidth: numberber;
}
