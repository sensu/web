import React, { useMemo } from "/vendor/react";
import { Md5 } from "ts-md5";
import AvatarIcon, { Animal, AvatarColor } from "/lib/component/base/AvatarIcon";

interface Props {
  username: string;
  size: string;
}

const IconValues = Object.values(Animal);
const ColourValues = Object.values(AvatarColor);

const hashStr = (str: string) => {
  const md5 = new Md5();
  const result = md5
    .start()
    .appendStr(str)
    .end(true);

  return result as Int32Array;
};

const UserAvatar = (props: Props) => {
  const { username } = props;
  const hash = useMemo(() => hashStr(username), [username]);

  return <AvatarIcon variant={IconValues[Math.abs(hash[0]) % IconValues.length]}
      color={ColourValues[Math.abs(hash[1]) % ColourValues.length]} />;
}

export default UserAvatar;
