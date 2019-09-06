import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const SmallCheckIcon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <g fill="currentColor">
        <path d="M18.75,16 C20.2687831,16 21.5,17.2312169 21.5,18.75 C21.5,20.2687831 20.2687831,21.5 18.75,21.5 C17.2312169,21.5 16,20.2687831 16,18.75 C16,17.2312169 17.2312169,16 18.75,16 Z M5.25,16 C6.76878306,16 8,17.2312169 8,18.75 C8,20.2687831 6.76878306,21.5 5.25,21.5 C3.73121694,21.5 2.5,20.2687831 2.5,18.75 C2.5,17.2312169 3.73121694,16 5.25,16 Z M18.75,17.5 C18.0596441,17.5 17.5,18.0596441 17.5,18.75 C17.5,19.4403559 18.0596441,20 18.75,20 C19.4403559,20 20,19.4403559 20,18.75 C20,18.0596441 19.4403559,17.5 18.75,17.5 Z M5.25,17.5 C4.55964406,17.5 4,18.0596441 4,18.75 C4,19.4403559 4.55964406,20 5.25,20 C5.94035594,20 6.5,19.4403559 6.5,18.75 C6.5,18.0596441 5.94035594,17.5 5.25,17.5 Z M12.25,2.5 C13.7687831,2.5 15,3.73121694 15,5.25 C15,6.76878306 13.7687831,8 12.25,8 C10.7312169,8 9.5,6.76878306 9.5,5.25 C9.5,3.73121694 10.7312169,2.5 12.25,2.5 Z M12.25,4 C11.5596441,4 11,4.55964406 11,5.25 C11,5.94035594 11.5596441,6.5 12.25,6.5 C12.9403559,6.5 13.5,5.94035594 13.5,5.25 C13.5,4.55964406 12.9403559,4 12.25,4 Z" />
        <path d="M14.4504902,18.25 L14.4504902,19.75 L9.45049024,19.75 L9.45049024,18.25 L14.4504902,18.25 Z M15.4144839,9.9541623 L17.9144839,14.2842893 L16.6154458,15.0342893 L14.1154458,10.7041623 L15.4144839,9.9541623 Z M8.48814768,9.55750395 L9.78718578,10.3075039 L7.28718578,14.637631 L5.98814768,13.887631 L8.48814768,9.55750395 Z" />
      </g>
    </SvgIcon>
  );
});
SmallCheckIcon.displayName = "SmallCheckIcon";

export default SmallCheckIcon;
