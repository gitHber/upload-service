import React, { useRef, useState } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const Area = styled.div`
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: #cecaca;
  text-align: center;
  line-height: 100px;
  font-size: 48px;
  color: #fff;
  font-weight: lighter;
  position: relative;
  cursor: pointer;
  user-select: none;
  span {
    position: absolute;
    line-height: 1;
    height: 20px;
    font-size: 12px;
    top: 70px;
    bottom: 5px;
    left: 50px;
    transform: translateX(-50%);
  }
  input {
    display: none;
  }
`;
const Button = styled.div`
  cursor: pointer;
  user-select: none;
  width: 80px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  color: #fff;
  background: gray;
  border: 1px solid #ccc;
  border-radius: 3px;
`;
const Img = styled.img`
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: #cecaca;
  text-align: center;
  line-height: 100px;
  font-size: 48px;
  color: #fff;
  font-weight: lighter;
  position: relative;
  cursor: pointer;
  user-select: none;
  margin-right: 5px;
`;

const UploadWrap = styled.div`
  display: flex;
  justify-content: center;
`;

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const input = useRef(null);
  const fileSelect = () => {
    (input.current as any).click();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files as any);
    console.log(e.target.files);
  };
  const upload = () => {
    const formData = new FormData();
    for (let file of files) {
      formData.append("file", file, file.name);
    }
    formData.append("name", "test");
    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    }).then((res) => {
      console.log(res);
    });
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFiles(
      Array.from(e.dataTransfer.files).filter((file) =>
        file.type.includes("image")
      )
    );
  };
  return (
    <Wrap>
      <UploadWrap>
        {Array.from(files).map((file) => {
          return (
            file.type.includes("image") && (
              <Img key={file.name} src={URL.createObjectURL(file)} />
            )
          );
        })}
        <Area
          onClick={fileSelect}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          +<span>可拖拽</span>
          <input
            accept=".jpg,.png"
            ref={input}
            type="file"
            multiple
            onChange={handleChange}
          />
        </Area>
      </UploadWrap>
      <Area onClick={fileSelect} style={{ marginTop: 10 }}>
        {!files.length && "+"}
        <span>{files.length ? files[0].name : "切片"}</span>
        <input ref={input} type="file" onChange={handleChange} />
      </Area>
      <Button draggable style={{ marginTop: 5 }} onClick={upload}>
        上传
      </Button>
    </Wrap>
  );
}
