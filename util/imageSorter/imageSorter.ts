import * as FS from 'fs';
import * as Nodegui from '@nodegui/nodegui';

// Could add later:
// Detect screen size using https://www.npmjs.com/package/screen-resolution

class ImageSorter {
  WIDTH: number = 1600;
  HEIGHT: number = 900;
  win = new Nodegui.QMainWindow();

  curPath = process.cwd();

  path1: string = '';
  path2: string = '';

  // pic1 = new Nodegui.QPixmap();
  // pic2 = new Nodegui.QPixmap();

  label1 = new Nodegui.QLabel();
  label2 = new Nodegui.QLabel();

  constructor () {
    this.setImages();

    const rootWidget = new Nodegui.QWidget();
    rootWidget.setObjectName('rootWidget');
    this.win.setCentralWidget(rootWidget);
  
    const layout = new Nodegui.FlexLayout();
    layout.setFlexNode(rootWidget.getFlexNode());
    rootWidget.setLayout(layout);

    layout.addWidget(this.label1, this.label1.getFlexNode());
    layout.addWidget(this.label2, this.label2.getFlexNode());
  
    rootWidget.setStyleSheet(`
      * {
        flex: 1;
        flex-direction: row;
      }
    `);

    this.makeDirs();

    this.win.addEventListener(Nodegui.WidgetEventTypes.KeyRelease, (input) => {
      if (! input) {
        return;
      }
  
      const keyEvt = new Nodegui.QKeyEvent(input);
      const text = keyEvt.text();
  
      console.log(`text is ${text}`);

      this.handleKey(text);
  
      /* console.log(`typeof nativeEvent is ${typeof nativeEvent}. 
      Is it null? ${nativeEvent == null}
      What is .text()? ${nativeEvent.text}
      What is .key()? ${nativeEvent.key}
      What is .code? ${nativeEvent.code}
      Stringify returns: ${JSON.stringify(nativeEvent)}.
      `); */
    });
  
    this.win.setGeometry(10, 10, this.WIDTH, this.HEIGHT);
    (global as any).win = this.win;

    this.win.show();
  }

  setImages (): void {
    this.setRandomPaths();

    let pic1 = new Nodegui.QPixmap();
    pic1.load(this.path1);
    pic1 = pic1.scaled(this.WIDTH / 2, this.HEIGHT, Nodegui.AspectRatioMode.KeepAspectRatio);
    this.label1.setPixmap(pic1);

    let pic2 = new Nodegui.QPixmap();
    pic2.load(this.path2);
    pic2 = pic2.scaled(this.WIDTH / 2, this.HEIGHT, Nodegui.AspectRatioMode.KeepAspectRatio);
    this.label2.setPixmap(pic2);
  }
  
  setRandomPaths (): void {
    // TDOO implement
    this.path1 = '/Users/mm76408/scratch/nodegui-starter/assets/1-24-red-handfish.jpg';
    this.path2 = '/Users/mm76408/scratch/nodegui-starter/assets/3zfhoa.jpg';

    console.log(`curPath is ${this.curPath}`);
    const everything = FS.readdirSync(this.curPath);
    everything.forEach(
      item => console.log(item)
    );

  }

  makeDirs (): void {
    // For each, check if present. If not, make it.
    // LATER
  }

  handleKey (input: string): void {
    if (! input) {
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
  }

  moveImages (input: string): void {
    const superiorPath = this.curPath + '/superior/';
    const inferiorPath = this.curPath + '/inferior/';

    const fileName1 = this.path1.slice(
      this.path1.lastIndexOf('/'),
      this.path1.length
    );

    const fileName2 = this.path2.slice(
      this.path2.lastIndexOf('/'),
      this.path2.length
    );

    if (input === '1') {
      const superiorDest = superiorPath + fileName1;
      const inferiorDest = inferiorPath + fileName2;
      console.log(`Going to call rename(${this.path1}, ${superiorDest})`);
      console.log(`Going to call rename(${this.path2}, ${inferiorDest})`);
      return;
    }

    const superiorDest = superiorPath + fileName2;
    const inferiorDest = inferiorPath + fileName1;
    console.log(`Going to call rename(${this.path2}, ${superiorDest})`);
    console.log(`Going to call rename(${this.path1}, ${inferiorDest})`);

  }
}

const sorter = new ImageSorter();
