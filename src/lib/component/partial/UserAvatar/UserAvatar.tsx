import React, { useMemo } from "/vendor/react";
import { Md5 } from "ts-md5";
import { Avatar, AvatarColour } from "/lib/component/base/AvatarIcon";

interface Props {
  username: string;
  size: string;
}

const IconValues = Object.values(Avatar);
const ColourValues = Object.values(AvatarColour);

const hashStr = (str: string) => {
  const md5 = new Md5();
  const result = md5
    .start()
    .appendStr(str)
    .end(true);

  return result as Int32Array;
};

const UserAvatar = (props: Props) => {
  const { username, size } = props;
  const hash = useMemo(() => hashStr(username), [username]);

  return <Avatar icon={IconValues[Math.abs(hash[0]) % IconValues.length]}
      colour={ColourValues[Math.abs(hash[1]) % ColourValues.length]} size={size} {...props} />;
}

export default UserAvatar;
