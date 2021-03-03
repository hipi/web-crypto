import React, { useState, createRef, useEffect } from "react";
import "./Crypto.scss";
import Process from "./../Process/Process";
import Result from "./../Result/Result";
import { generateKey, getFileSize, checkPassWord } from "./../../utils";
import { encryptFile, decryptFile } from "./../../utils/file";
import refreshImg from "./../../assets/refresh.svg";
function Crypto(props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [FILE, setFILE] = useState(null);

  const customFile = createRef();

  const [fileInfo, setFileInfo] = useState("选择文件进行加密/解密");
  const [fileSize, setFileSize] = useState("");
  const [dKey, setDkey] = useState("");

  // process
  const [percentage, setPercentage] = useState(0);
  const [percentageText, setPercentageText] = useState("");
  const [percentageColor, setPercentageColor] = useState("#b3d8ff");

  // 结果
  const [result, setResult] = useState({});

  /* 重置表单 */
  const resetForm = () => {
    setFILE(null);
    setDkey("");
    setFileInfo("选择文件进行加密/解密");
    setFileSize("");
    setPercentage(0);
    setPercentageText("");
  };

  useEffect(() => {
    if (!FILE) {
      customFile.current.value = "";
    }
  }, [FILE]);

  /* 上传文件 */
  const uploadFile = (e) => {
    const inputFile = e.target.files[0];
    if (!inputFile) {
      setFILE(null);
      setFileInfo("选择文件进行加密/解密");
      setFileSize("");
      return false;
    }
    setFILE(inputFile);
    setFileInfo(inputFile.name);
    let nBytes = inputFile.size;
    setFileSize(getFileSize(nBytes));
    // 判断文件名是否是解密的
    let reg = /Encrypted#[^ \f\n\r\t\v#]*#/;
    if (inputFile.name.match(reg)) {
      const password = inputFile.name
        .match(reg)[0]
        .replace("Encrypted#", "")
        .replace("#", "");
      setDkey(password);
      keyCheckMeter(password);
    } else {
      setDkey("");
    }
  };

  /* 密码强度检测 */
  const keyCheckMeter = (val) => {
    let strength = [
      { key: 0, str: "糟糕", per: 10, color: "#f73131" },
      { key: 1, str: "勉强", per: 30, color: "#f56c6c" },
      { key: 2, str: "一般", per: 60, color: "#e6a23c" },
      { key: 3, str: "很强", per: 90, color: "#87d068" },
      { key: 4, str: "超强", per: 100, color: "#87d068" },
    ];
    if (val) {
      const score = checkPassWord(val);
      const list = strength.find((item) => item.key === score);
      setPercentage(list.per);
      setPercentageColor(list.color);
      setPercentageText(list.str);
    } else {
      setPercentage(0);
      setPercentageColor("#f5f5f5");
      setPercentageText("");
    }
  };
  const handleKeyChange = (e) => {
    let val = e.target.value;
    val = val.replace(/#/g, "");
    // 去除汉字
    // val = val.replace(/#|[\u4E00-\u9FA5]/g, "");
    setDkey(val);
    keyCheckMeter(val);
  };

  /* 刷新密码 */
  const refreshKey = () => {
    const key = generateKey();
    setDkey(key);
    keyCheckMeter(key);
  };
  /* 加密文件 */
  const handleEncryptFile = async () => {
    if (!FILE || !dKey) {
      return alert("请上传文件或输入密码");
    }
    props.changeLoading(true);
    const [status, data] = await encryptFile(FILE, dKey);

    if (!status) {
      return alert(data);
    }
    handleFinished(data);

    resetForm();

    props.changeLoading(false);
  };
  /* 解密文件 */
  const handleDecryptFile = async () => {
    if (!FILE || !dKey) {
      return alert("请上传文件或输入密码");
    }
    props.changeLoading(true);
    const [status, data] = await decryptFile(FILE, dKey);

    if (!status) {
      return alert(data);
    }
    handleFinished(data);

    resetForm();
    props.changeLoading(false);
  };

  const handleFinished = (data) => {
    const { nameStr, buffer, type, password } = data;
    const blobData = new Blob(buffer, {
      type: "application/octet-stream",
    });
    const blobStr = URL.createObjectURL(blobData);
    setResult({ nameStr, password, type, blobStr });
  };

  return (
    <div className="crypto">
      <label className="file-upload">
        <input
          type="file"
          ref={customFile}
          className={`custom-file-input ${isDragOver ? "over" : ""}`}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={() => setIsDragOver(false)}
          onChange={uploadFile}
        />

        <div className="file-placeholder">
          <span className="file-name">{fileInfo}</span>
          {fileSize && <span className="file-size">{fileSize}</span>}
          <span className="file-select">选择文件</span>
        </div>
      </label>

      <div className="key">
        <input
          type="text"
          placeholder="请输入密码/右边按钮自动生成"
          className="key-input"
          spellCheck="false"
          value={dKey}
          onChange={handleKeyChange}
        />
        <button onClick={refreshKey} title="自动生成密码" className="key-btn">
          <img className="key-refresh" src={refreshImg} alt="" />
        </button>
      </div>
      <div className="key-check">
        <div>密码强度：{percentageText}</div>
        <Process percent={percentage} strokeColor={percentageColor} />
      </div>
      <div className="operate">
        <button className="primary" onClick={handleEncryptFile}>
          加密
        </button>
        <button className="success" onClick={handleDecryptFile}>
          解密
        </button>
        <button
          className="danger"
          onClick={() => {
            window.location.reload();
          }}
        >
          重置
        </button>
      </div>
      <Result result={result}></Result>
    </div>
  );
}
export default Crypto;
