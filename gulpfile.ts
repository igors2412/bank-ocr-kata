import gulpClean = require('gulp-clean');
const { src } = require('gulp');

function clean() {
    return src(['./build/'], { allowEmpty: true }).pipe(gulpClean());
}

exports.default = clean;
