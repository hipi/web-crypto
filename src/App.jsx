import React, { useState } from "react";

// 组件

import Spin from "./components/Spin/Spin";
import Crypto from "./components/Crypto/Crypto";
function app() {
  const [loading, setLoading] = useState(false);

  return (
    <Spin spinning={loading}>
      <Crypto changeLoading={(loading) => setLoading(loading)} />
    </Spin>
  );
}
export default app;
