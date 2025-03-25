// Renders simple procgen faces.

class Face {
    constructor () {
        // this.eyeType = 

        this.canvas = document.getElementById('faceCanvas')
            .getContext('2d');
        // this.ctx = this.canvas.getContext('2d');
    }

    render () {
        // LATER output a image. Currently draw to html canvas.

        this.renderEyes();
        this.renderNose();
        this.renderMouth();
        this.renderHair();

        // DEBUG
        this.canvas.fillStyle = 'blue';
        this.canvas.fillRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);

        this.canvas.fillStyle = 'black';
        
        this.canvas.fillRect(50, 50, 50, 50);
        // TODO this test square is vertically stretched for some reason.
    }

    renderEyes () {

    }

    renderNose () {

    }

    renderMouth () {
        this.canvas.strokeStyle = 'black';
        this.canvas.lineWidth = 10;
        this.canvas.beginPath();
        this.canvas.moveTo(200, 500);
        this.canvas.quadraticCurveTo(300, 400, 400, 500);
        this.canvas.stroke();

        console.log('mouth stroked');
    }

    renderHair () {

    }

    static run () {
        window.addEventListener('load', () => {
            const face = new Face();

            face.render();
        });
    }
}

Face.run();
