import * as koa from "koa";
import * as koaBody from "koa-body";
import * as koaStatic from "koa-static";
import * as cors from "koa2-cors";
import { resolve, dirname } from "path";
import * as fs from "fs";

const port = 8000;
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
  let files: any = ctx.request.files;
  files =
    files.file && (files.file instanceof Array ? files.file : [files.file]);
  if (files) {
    let fileUrls = [];
    for (let file of files) {
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

app.listen(port, () => {
  console.log(`------[Server start port on ${host}]------`);
});
