import * as koa from "koa";
import * as koaBody from "koa-body";
import * as koaStatic from "koa-static";
import * as cors from "koa2-cors";
import { resolve, dirname } from "path";
import * as fs from "fs";

const port = 3000;
const host = `http://localhost:${port}`;
const app = new koa();

app.use(cors());
// 解析上传文件服务，保存文件
app.use(
  koaBody({
    formidable: {
      uploadDir: resolve(__dirname, "./static")
    },
    multipart: true
  })
);
// 访问静态文件服务
app.use(koaStatic(resolve(__dirname, "./static")));
app.use(ctx => {
  // 获取上传后的文件
  let files = ctx.request.files;
  if (files.file) {
    let file = files.file;
    // 生成的新路径 upload+随机id
    let path = file.path;
    let fname = file.name;
    if (file.size > 0 && path) {
      let dir = dirname(path);
      fs.renameSync(path, `${dir}/${fname}`);
    }
    ctx.response.type = "json";
    ctx.body = {
      fileUrl: `${host}/${fname}`
    };
  } else if (files.files instanceof Array) {
    let fileUrls = [];
    for (let file of files.files) {
      let path = file.path;
      let fname = file.name;
      if (file.size > 0 && path) {
        let dir = dirname(path);
        fs.renameSync(path, `${dir}/${fname}`);
        fileUrls.push({ fileUrl: `${host}/${fname}` });
      }
    }
    ctx.response.type = "json";
    ctx.body = fileUrls;
  } else {
    ctx.body = "null";
  }
});

app.listen(3000, () => {
  console.log(`------[Server start port on ${host}]------`);
});
