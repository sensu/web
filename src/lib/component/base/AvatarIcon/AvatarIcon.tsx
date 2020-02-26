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

export enum Animal {
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
  BLUE = "#b3e7db",
  GREEN = "#b9e7b3",
  RED = "#e7bdb3",
  ORANGE = "#e7d8b3",
  PURPLE = "#c7b3e7",
  YELLOW = "#e7e4b3",
  CYAN = "#e7b3d3",
}

interface Props {
  variant: Animal;
  color: AvatarColor;
}

const mapping = {
  [Animal.BEAR]: BearAvatar,
  [Animal.BIRD]: BirdAvatar,
  [Animal.BUTTERFLY]: ButterflyAvatar,
  [Animal.CAT]: CatAvatar,
  [Animal.CROC]: CrocAvatar,
  [Animal.DEER]: DeerAvatar,
  [Animal.DOG]: DogAvatar,
  [Animal.FISH]: FishAvatar,
  [Animal.LION]: LionAvatar,
  [Animal.MONKEY]: MonkeyAvatar,
  [Animal.PENGUIN]: PenguinAvatar,
  [Animal.SEAL]: SealAvatar,
  [Animal.SNAKE]: SnakeAvatar,
  [Animal.RABBIT]: RabbitAvatar,
  [Animal.REDPANDA]: RedPandaAvatar,
  [Animal.WOLF]: WolfAvatar,
};

const AvatarIcon = ({ variant, color, ...props }: Props) => {
  const Component = mapping[variant];
  return <Component color={color} {...props} />;
};

AvatarIcon.defaultProps = {
  color: AvatarColor.BLUE,
};

export default React.memo(AvatarIcon);
