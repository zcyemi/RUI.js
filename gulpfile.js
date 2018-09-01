const gulp = require('gulp');
const gulpts = require('gulp-typescript');
const browersync = require('browser-sync');
const through = require('through2')
const path = require('path');
const fs = require('fs');
const util = require('util');
const seq = require('gulp-sequence');
const child_process = require('child_process');

const gulprun = require('gulp-run');

gulp.task("build", () => {
    BuildShader();
    BuildScript();
});

gulp.task("watch", () => {
    BuildScript();
    BuildShader();
    gulp.watch('./src/script/**/*.ts', BuildScript);
    gulp.watch('./src/shader/*.glsl', BuildShader);
});

gulp.task('run-sample',()=>{
    RunSample();
});

gulp.task("build-sample",()=>{
    BuildShader();
    BuildSample();
})


gulp.task("watch-sample",()=>{
    BuildSample();
    gulp.watch('./src/script/**/*.ts', BuildSample);
    gulp.watch('./src/shader/*.glsl', BuildShader);
    gulp.watch('./sample/src/*.ts',()=>{BuildSample(false)});
    RunSample();
})

gulp.task("shader",()=>{
    BuildShader();
});

gulp.task("builscript",BuildScript);
gulp.task("buildsample",BuildSample);


function asyncGenDeclaration(){
    return new Promise(resolve=>{
        console.log('[gen declaration]');
        child_process.exec('tsc --module amd --outFile ./dist/rui.js --emitDeclarationOnly',(error,stdout,stderr)=>{
            if(stdout != null && stdout != '') console.log(stdout);
            if(stderr != null && stderr != '') console.log(stderr);
            resolve();
        });
    });
}

function asyncBuildLib(){
    return new Promise(resolve=>{
        console.log('[build lib]');
        child_process.exec('rollup -c rollup.config.ts',(error,stdout,stderr)=>{
            if(stdout != null && stdout != '') console.log(stdout);
            if(stderr != null && stderr != '') console.log(stderr);
            resolve();
        });
    });
}

function asyncBuildSample(){
    return new Promise(resolve=>{
        console.log('[build sample]');
        child_process.exec('tsc -p ./sample',(error,stdout,stderr)=>{
            if(stdout != null && stdout != '') console.log(stdout);
            if(stderr != null && stderr != '') console.log(stderr);
            resolve();
        });
    });
}

async function BuildScript() {
    await asyncGenDeclaration();
    await asyncBuildLib();
}


var onBuildSample =false;
var onSchedulerBuild =false;

async function BuildSample(rebuildlib = true) {
    onSchedulerBuild = false;
    if(onBuildSample){
        if(!onSchedulerBuild){
            onSchedulerBuild = true;
            setTimeout(BuildSample,5000);
        }
        return;
    }
    onBuildSample = true;

    if(rebuildlib){
        await asyncGenDeclaration();
        await asyncBuildLib();
    }
    await asyncBuildSample();
    gulp.src('./dist/rui.js').pipe(gulp.dest('./sample/js/'));
    onBuildSample = false;
}

function RunSample(){
    browersync.init({
        server: {
            baseDir: './sample/',
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        },
        port: 6633,
        files: ['./sample/js/*.js', './sample/*.html']
    })
}


function BuildShader() {
    console.log('[sync shader]');
    gulp.src('./src/shader/*.glsl').pipe(gulpGLSLMerge('/src/script/rui/RUIShaderLib.ts'));
}


function gulpGLSLMerge(targetFile) {
    var tarFile = targetFile;
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }
        if (file.isBuffer()) {
            var fname = path.basename(file.path);
            let contents = file.contents;
            let tspath = path.join(process.cwd(), targetFile);
            let tscontent = fs.readFileSync(tspath, { encoding: 'utf8' });
            tscontent = MergeShaderLibTs(fname, contents.toString(), tscontent);
            fs.writeFileSync(tspath, tscontent, { encoding: 'utf8' });
            cb(null, file);
            return;
        }
        if (file.isStream()) {
            console.log("stream: skip");
            cb(null, file);
            return;
        }
    });
}

function MergeShaderLibTs(fname, source, ts) {
    fname = fname.toString();
    if (fname.endsWith('.glsl')) fname = fname.substr(0, fname.length - 5);
    fname = 'GLSL_' + fname.toUpperCase();
    let srcSplit = source.split('\n');

    for (var i = 0; i < srcSplit.length; i++) {
        srcSplit[i] = srcSplit[i].trim();
    }

    let mergetdGlsl = srcSplit.join('\\n');
    mergetdGlsl = '\'' + mergetdGlsl + '\';';

    let tsSplit = ts.split('\n');
    let shLines = {};
    tsSplit.forEach(line => {
        if (line.includes('export const')) {
            let match = line.match(/export const\s+([\w\d_]+)\s*=(.+)/);
            if (match) {
                shLines[match[1]] = match[2];
            }
        }
    });
    shLines[fname] = mergetdGlsl;

    let result = '';// 'namespace cis {\n';
    for (var sh in shLines) {
        result += util.format('export const %s = %s \n', sh, shLines[sh]);
    }
    //result+='}';
    return result;
}