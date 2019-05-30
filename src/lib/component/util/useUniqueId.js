import React from "/vendor/react";

import uniqueId from "/lib/util/uniqueId";

const useUniqueId = () => React.useMemo(uniqueId, []);

export default useUniqueId;
