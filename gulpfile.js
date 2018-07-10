const gulp = require('gulp');
const gulpts = require('gulp-typescript');
const browersync = require('browser-sync');

gulp.task("build",()=>{
    BuildScript();
    BuildTemplate();
});

gulp.task("watch",()=>{
    gulp.watch('./src/script/**/*.ts',BuildScript);
    gulp.watch('./src/template/**.*',BuildTemplate);

    browersync.init({
        server: {
            baseDir: './dist/'
        },
        port: 6633,
        files: ['*.js', 'index.html']
    })
});

function BuildScript(){
    console.log('[sync script]');
    gulp.src('./src/script/**/*.ts').pipe(gulpts({
        module: 'amd',
        declaration: true,
        outFile: 'rui.js'
    }))
    .pipe(gulp.dest('./dist/'));
}

function BuildTemplate(){
    console.log('[sync template]');
    gulp.src('./src/template/**.*').pipe(gulp.dest('./dist'));
}