import React from "/vendor/react";
import {
  BearAvatar,
  BirdAvatar,
  ButterflyAvatar,
  CatAvatar,
  CrocAvatar,
  DeerAvatar,
  DogAvatar,
  FishAvatar,
  LionAvatar,
  MonkeyAvatar,
  PenguinAvatar,
  RabbitAvatar,
  RedPandaAvatar,
  SealAvatar,
  SnakeAvatar,
  WolfAvatar,
} from "/lib/component/icon/avatar";

export enum Avatar {
  BEAR = "BEAR",
  BIRD = "BIRD",
  BUTTERFLY = "BUTTERFLY",
  CAT = "CAT",
  CROC = "CROC",
  DEER = "DEER",
  DOG = "DOG",
  FISH = "FISH",
  LION = "LION",
  MONKEY = "MONKEY",
  PENGUIN = "PENGUIN",
  RABBIT = "RABBIT",
  REDPANDA = "REDPANDA",
  SEAL = "SEAL",
  SNAKE = "SNAKE",
  WOLF = "WOLF",
}

export enum AvatarColor {
  BLUE = "#B2CEFE",
  GREEN = "#BAED91",
  RED = "#FEA3AA",
  ORANGE = "#F8B88B",
  YELLOW = "#FAF884",
  CYAN = "#F2A2E8",
}

interface Props {
  variant: Avatar;
  color: AvatarColor;
}

const mapping = {
  [Avatar.BEAR]: BearAvatar,
  [Avatar.BIRD]: BirdAvatar,
  [Avatar.BUTTERFLY]: ButterflyAvatar,
  [Avatar.CAT]: CatAvatar,
  [Avatar.CROC]: CrocAvatar,
  [Avatar.DEER]: DeerAvatar,
  [Avatar.DOG]: DogAvatar,
  [Avatar.FISH]: FishAvatar,
  [Avatar.LION]: LionAvatar,
  [Avatar.MONKEY]: MonkeyAvatar,
  [Avatar.PENGUIN]: PenguinAvatar,
  [Avatar.SEAL]: SealAvatar,
  [Avatar.SNAKE]: SnakeAvatar,
  [Avatar.RABBIT]: RabbitAvatar,
  [Avatar.REDPANDA]: RedPandaAvatar,
  [Avatar.WOLF]: WolfAvatar,
};

const AvatarIcon = ({ variant, color, ...props }: Props) => {
  const Component = mapping[variant];
  return <Component color={color} {...props} />;
};

AvatarIcon.defaultProps = {
  color: AvatarColor.BLUE,
};

export default React.memo(AvatarIcon);
