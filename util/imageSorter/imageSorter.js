"use strict";
exports.__esModule = true;
var FS = require("fs");
var Nodegui = require("@nodegui/nodegui");
// Could add later:
// Detect screen size using https://www.npmjs.com/package/screen-resolution
var ImageSorter = /** @class */ (function () {
    function ImageSorter() {
        var _this = this;
        this.WIDTH = 1600;
        this.HEIGHT = 900;
        this.win = new Nodegui.QMainWindow();
        this.curPath = process.cwd();
        this.path1 = '';
        this.path2 = '';
        // pic1 = new Nodegui.QPixmap();
        // pic2 = new Nodegui.QPixmap();
        this.label1 = new Nodegui.QLabel();
        this.label2 = new Nodegui.QLabel();
        this.setImages();
        var rootWidget = new Nodegui.QWidget();
        rootWidget.setObjectName('rootWidget');
        this.win.setCentralWidget(rootWidget);
        var layout = new Nodegui.FlexLayout();
        layout.setFlexNode(rootWidget.getFlexNode());
        rootWidget.setLayout(layout);
        layout.addWidget(this.label1, this.label1.getFlexNode());
        layout.addWidget(this.label2, this.label2.getFlexNode());
        rootWidget.setStyleSheet("\n      * {\n        flex: 1;\n        flex-direction: row;\n      }\n    ");
        this.makeDirs();
        this.win.addEventListener(Nodegui.WidgetEventTypes.KeyRelease, function (input) {
            if (!input) {
                return;
            }
            var keyEvt = new Nodegui.QKeyEvent(input);
            var text = keyEvt.text();
            console.log("text is " + text);
            _this.handleKey(text);
            /* console.log(`typeof nativeEvent is ${typeof nativeEvent}.
            Is it null? ${nativeEvent == null}
            What is .text()? ${nativeEvent.text}
            What is .key()? ${nativeEvent.key}
            What is .code? ${nativeEvent.code}
            Stringify returns: ${JSON.stringify(nativeEvent)}.
            `); */
        });
        this.win.setGeometry(10, 10, this.WIDTH, this.HEIGHT);
        global.win = this.win;
        this.win.show();
    }
    ImageSorter.prototype.setImages = function () {
        this.setRandomPaths();
        var pic1 = new Nodegui.QPixmap();
        pic1.load(this.path1);
        pic1 = pic1.scaled(this.WIDTH / 2, this.HEIGHT, Nodegui.AspectRatioMode.KeepAspectRatio);
        this.label1.setPixmap(pic1);
        var pic2 = new Nodegui.QPixmap();
        pic2.load(this.path2);
        pic2 = pic2.scaled(this.WIDTH / 2, this.HEIGHT, Nodegui.AspectRatioMode.KeepAspectRatio);
        this.label2.setPixmap(pic2);
    };
    ImageSorter.prototype.setRandomPaths = function () {
        // TDOO implement
        this.path1 = '/Users/mm76408/scratch/imageTest/1-24-red-handfish.jpg';
        this.path2 = '/Users/mm76408/scratch/imageTest/3zfhoa.jpg';
        console.log("curPath is " + this.curPath);
        var everything = FS.readdirSync(this.curPath);
        everything.forEach(function (item) { return console.log(item); });
    };
    ImageSorter.prototype.makeDirs = function () {
        // For each, check if present. If not, make it.
        // LATER
    };
    ImageSorter.prototype.handleKey = function (input) {
        if (!input) {
            return;
        }
        if (input === '1' || input === '2') {
            this.moveImages(input);
            this.setImages();
            return;
        }
        if (/[0-9]/.test(input)) {
            // Interpret as 'neither'
            this.setImages();
            return;
        }
    };
    ImageSorter.prototype.moveImages = function (input) {
        var superiorPath = this.curPath + '/superior/';
        var inferiorPath = this.curPath + '/inferior/';
        var fileName1 = this.path1.slice(this.path1.lastIndexOf('/'), this.path1.length);
        var fileName2 = this.path2.slice(this.path2.lastIndexOf('/'), this.path2.length);
        if (input === '1') {
            var superiorDest_1 = superiorPath + fileName1;
            var inferiorDest_1 = inferiorPath + fileName2;
            console.log("Going to call rename(" + this.path1 + ", " + superiorDest_1 + ")");
            console.log("Going to call rename(" + this.path2 + ", " + inferiorDest_1 + ")");
            return;
        }
        var superiorDest = superiorPath + fileName2;
        var inferiorDest = inferiorPath + fileName1;
        console.log("Going to call rename(" + this.path2 + ", " + superiorDest + ")");
        console.log("Going to call rename(" + this.path1 + ", " + inferiorDest + ")");
    };
    return ImageSorter;
}());
var sorter = new ImageSorter();
// npm script error 2021 Oct 3
// Module not found: Error: Can't resolve './src' in...
