import * as Koa from "koa";
import * as KoaBody from "koa-body";
import { pathToFileURL } from "url";
import { resolve } from "path";
const app = new Koa();

app.use(
  KoaBody({
    formidable: {
      uploadDir: resolve(__dirname, "./static/files")
    },
    multipart: true
  })
);

app.listen(3000, () => {
  console.log("------[Server start port on http://localhost:3000]------");
});
