export default function js(RATIO: number) {
  return (
    `(` +
    function(RATIO: number) {
      const REAL_PIXEL_RATIO: number = RATIO;
      const canvas = <HTMLCanvasElement>document.createElement('canvas');
      const { clientHeight, clientWidth } = document.body;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      function dp2px(dp: number) {
        return dp * REAL_PIXEL_RATIO;
      }
      canvas.height = dp2px(clientHeight);
      canvas.width = dp2px(clientWidth);
      canvas.style.height = clientHeight + 'px';
      canvas.style.width = clientWidth + 'px';
      document.body.appendChild(canvas);
      interface Coor {
        x: number;
        y: number;
      }
      function getCoorFromTouchs(touchs: any): Coor | null {
        if (!touchs || !touchs[0]) {
          return null;
        }
        const { clientX, clientY } = touchs[0];
        return {
          x: dp2px(clientX),
          y: dp2px(clientY)
        };
      }
      canvas.addEventListener('touchmove', paint);
      canvas.addEventListener('touchstart', startPaint);
      canvas.addEventListener('touchend', endPaint);
      if (!canvas) {
        return;
      }
      function paint(event: TouchEvent) {
        const { touches } = event;
        const coor = getCoorFromTouchs(touches);
        if (coor) {
          context.lineTo(coor.x, coor.y);
          context.stroke();
        }
      }
      function startPaint(event: TouchEvent) {
        const { touches } = event;
        const coor = getCoorFromTouchs(touches);

        context.beginPath();
        if (coor) {
          context.moveTo(coor.x, coor.y);
        }
      }
      function endPaint(event: TouchEvent) {
        const { touches } = event;
        context.closePath();
      }
      interface CanvasProps {
        color?: string;
        backgroundColor?: string;
        lineWidth?: number;
      }
      const canvasProps: CanvasProps = {};
      const context = <CanvasRenderingContext2D>canvas.getContext('2d');

      function setCanvas({
        color = '#000',
        lineWidth = 6,
        backgroundColor = '#fff'
      }: CanvasProps) {
        canvasProps.color = color;
        canvasProps.lineWidth = dp2px(lineWidth);
        canvasProps.backgroundColor = backgroundColor;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = canvasProps.lineWidth;
        // context.fillStyle = canvasProps.backgroundColor;
        // context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = canvasProps.color;
      }
      function createBlob(): File {
        let data = getImage().split(',');
        let mime = data[0].match(/:(.*?);/)[1];
        let bstr = atob(data[1]),
          l = bstr.length,
          buffer = new Uint8Array(l);
        while (l--) {
          buffer[l] = bstr.charCodeAt(l);
        }
        const filename = 'file.png';
        return new File([buffer], filename, { type: mime });
      }

      function getImage() {
        return canvas.toDataURL();
      }
      function upload(url: string, params: { [idx: string]: any }) {
        let formData = new FormData();
        const file = createBlob();
        formData.append('file', file);
        formData.append('fname', file.name);
        for (let p in params) {
          formData.append(p, params[p]);
        }
        return fetch(url, { method: 'post', body: formData })
          .then(
            res => {
              return res.json().then(data => {
                return data;
              });
            },
            e => {
              Promise.reject(e);
            }
          )
          .catch(e => {
            Promise.reject(e);
          });
      }
      function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      nativeWebView.injectMethod('getImage', getImage);
      nativeWebView.injectMethod('upload', upload);
      nativeWebView.injectMethod('clear', clear);

      setCanvas(canvasProps);
    }.toString() +
    `)(${RATIO});`
  );
}
