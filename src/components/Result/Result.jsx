import React, { useState } from "react";
import "./Result.scss";
function Result(props) {
  const resultType = {
    encrypt: "加密",
    decrypt: "解密",
  };
  const result = Object.keys(props.result).length > 0 ? props.result : null;

  return (
    <div className="result">
      {result && (
        <div className="result-list">
          <a className="file-name">{result.nameStr}</a>
          <strong>{resultType[result.type]}成功</strong>
          <div className="btn-group">
            <a
              className="download-link"
              target="_blank"
              href={result.blobStr}
              download={result.nameStr}
            >
              <span>点击下载已经{resultType[result.type]}的文件</span>
            </a>
            {result.type === "encrypt" && (
              <span className="decryption-key">
                密钥 :<span> {result.password}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default Result;
