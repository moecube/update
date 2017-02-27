/**
 * Created by zh99998 on 2016/12/13.
 */
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import * as hbs from "koa-hbs";
import * as path from "path";
import * as fs from "fs";

const convert = require('koa-convert');
const co = require('co');

const app = new Koa();

app.use(convert((<any>hbs).middleware({
    viewPath: __dirname + '/views',
})));
app.use(async(ctx, next) => {
    const render = ctx['render'];
    ctx['render'] = async function _convertedRender() {
        return co.call(ctx, render.apply(ctx, arguments))
    };
    await next();
});

app.use(bodyParser());

const router = new Router();

router.post('/:package_id', async(ctx) => {

    console.log(ctx.params.package_id);

    let package_id = ctx.params.package_id;
    let request_overhead = 1024 * 1024;
    let package_path = path.join('/data/release/downloads', package_id);

    let full_size = fs.statSync(path.join(package_path, 'full', `${package_id}.tar.gz`)).size;
    let sand_size = ctx.request.body.length * request_overhead;

    let files;
    if (full_size > sand_size) {
        files = ctx.request.body.map((file) => {
            // TODO: 异步
            let hash = fs.readFileSync(path.join(package_path, 'sand', `${file.replace(/\//g, '__')}.checksum.txt`), {encoding: 'utf8'});
            let size = fs.statSync(path.join(package_path, 'sand', `${file.replace(/\//g, '__')}.tar.gz`)).size;
            sand_size += size;
            return {
                name: `${hash}.tar.gz`,
                hash: hash,
                size: size
            }
        });
    }

    if (full_size <= sand_size) {
        files = [{
            name: `${package_id}.tar.gz`,
            hash: fs.readFileSync(path.join(package_path, 'full', `${package_id}.checksum.txt`), {encoding: 'utf8'}),
            size: full_size
        }]
    }

    console.log(files);

    await ctx['render']('update', {files: files})
});

app.use(router.routes());

app.listen(80);