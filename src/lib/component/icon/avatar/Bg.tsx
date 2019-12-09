import React from "/vendor/react";

interface Props {
  color: string;
  children: React.ReactElement | React.ReactElement[];
}

interface OvalProps {
  r: string | number;
}

const Oval = ({ r }: OvalProps) => <circle cx="32" cy="32" r={r} />;

const Bg = React.memo(({ color, children }: Props) => {
  return (
    <React.Fragment>
      <g fill="none" fillRule="evenodd">
        <mask id="z" fill="#fff">
          <Oval r={32} />
        </mask>
        <g
          fill={color}
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity={0.71}
        >
          <Oval r={31} />
        </g>
        <g mask="url(#z)">{children}</g>
      </g>
    </React.Fragment>
  );
});
Bg.displayName = "Avatar.Background";

export default Bg;
