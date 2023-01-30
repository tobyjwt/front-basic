export const TOOL_MAP = {
  CIRCLE: 'circle',
  ARROW: 'arrow',
  TEXT: 'text'
};

export default class CameraTool {
  controller = null; // 容器
  textInputController = null; // 文本容器
  toolName = 'none'; // 当前工具
  clickFlag = false;
  graphData = {
    startX: 0,
    startY: 0,
    width: 0,
    height: 0
  };
  color = 'red';
  penSize = '3';
  history = [];
  undoClickNum = 0;
  maxUndoNum = 99; // 最大步骤

  constructor(controller, width, height, textInputController) {
    this.controller = controller;
    this.textInputController = textInputController;
    this.context = controller.getContext('2d');
    this.controller && this.controller.addEventListener('mousedown', this.mouseDownEvent);
    this.controller && this.controller.addEventListener('mousemove', this.mouseMoveEvent);
    this.controller && this.controller.addEventListener('mouseup', this.mouseUpEvent);
    this.graphData.width = width;
    this.graphData.height = height;
  }

  setToolName(toolName) {
    this.toolName = toolName;
  }

  mouseDownEvent = (event) => {
    if (this.toolName === 'none') return;
    const mouseX = (event.offsetX);
    const mouseY = (event.offsetY);
    this.graphData.startX = mouseX;
    this.graphData.startY = mouseY;
    if (this.toolName === TOOL_MAP.TEXT) {
      if (this.textInputController.style.visibility === 'hidden' || this.textInputController.innerText === '') {
        this.textInputController.style.visibility = 'visible';
        const textMouseX = mouseX - 15;
        const textMouseY = mouseY - 15;
        this.textPosition = {
          x: mouseX,
          y: mouseY
        };
        this.textInputController.style.left = textMouseX + 'px';
        this.textInputController.style.top = textMouseY + 'px';
        setTimeout(() => {
          this.textInputController.focus();
        }, 100);
      } else { // draw
        this.addHistory();
        this.drawText(this.textInputController.innerText, this.textPosition.x - 7, this.textPosition.y + 6, this.color, 12);
        this.textInputController.innerText = '';
        this.textInputController.style.visibility = 'hidden';
      }
    } else {
      this.clickFlag = true;
      this.addHistory();
    }
  };

  mouseMoveEvent = throttle((event) => {
    if (this.toolName === 'none' || !this.clickFlag) return;

    const { startX, startY } = this.graphData;
    const mouseX = (event.offsetX);
    const mouseY = (event.offsetY);
    this.showLastHistory();
    switch (this.toolName) {
      case TOOL_MAP.CIRCLE: this.drawCircle(mouseX, mouseY, startX, startY, this.penSize, this.color); break;
      case TOOL_MAP.ARROW: this.drawLineArrow(mouseX, mouseY, startX, startY, 33, this.penSize, this.color);
    }
  }, 50);

  mouseUpEvent = () => {
    this.clickFlag = false;
  }

  drawCircle = (
    mouseX,
    mouseY,
    mouseStartX,
    mouseStartY,
    borderWidth,
    color
  ) => {
    const startX = mouseX < mouseStartX ? mouseX : mouseStartX;
    const startY = mouseY < mouseStartY ? mouseY : mouseStartY;
    const endX = mouseX >= mouseStartX ? mouseX : mouseStartX;
    const endY = mouseY >= mouseStartY ? mouseY : mouseStartY;
    // 计算圆的半径
    const radiusX = (endX - startX) * 0.5;
    const radiusY = (endY - startY) * 0.5;
    // 计算圆心的x、y坐标
    const centerX = startX + radiusX;
    const centerY = startY + radiusY;
    // 开始绘制
    const context = this.context;
    context.save();
    context.beginPath();
    context.lineWidth = borderWidth;
    context.strokeStyle = color;

    if (typeof context.ellipse === 'function') {
      // 绘制圆，旋转角度与起始角度都为0，结束角度为2*PI
      context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    } else {
      console.log('你的浏览器不支持ellipse，无法绘制椭圆');
    }
    context.stroke();
    context.closePath();
    // 结束绘制
    context.restore();
  }

  /**
   * 绘制箭头， p1 箭头尾， p2 箭头头， p3p4斜线尾
   * @param mouseStartX 鼠标按下时的x轴坐标 P1
   * @param mouseStartY 鼠标按下式的y轴坐标 P1
   * @param mouseX 当前鼠标x轴坐标 P2
   * @param mouseY 当前鼠标y轴坐标 P2
   * @param theta 箭头斜线与直线的夹角角度 (θ) P3 ---> (P1、P2) || P4 ---> P1(P1、P2)
   * @param borderWidth 边框宽度
   * @param color 边框颜色
   */

  drawLineArrow = (
    mouseStartX,
    mouseStartY,
    mouseX,
    mouseY,
    theta,
    borderWidth,
    color
  ) => {
    const length = Math.sqrt(Math.pow(mouseStartY - mouseY, 2) + Math.pow(mouseStartX - mouseX, 2)); // p1-p2长度
    const headlen = Math.min(length / 3, 20); // 箭头斜线的长度 P3 ---> P2 || P4 ---> P2, 斜线长度最大20
    const angle =
      (Math.atan2(mouseStartY - mouseY, mouseStartX - mouseX) * 180) / Math.PI; // 通过atan2来获取箭头的角度
    const angle1 = ((angle + theta) * Math.PI) / 180; // P3点的角度
    const angle2 = ((angle - theta) * Math.PI) / 180; // P4点的角度
    const topX = headlen * Math.cos(angle1); // P3点的x轴坐标
    const topY = headlen * Math.sin(angle1); // P3点的y轴坐标
    const botX = headlen * Math.cos(angle2); // P4点的X轴坐标
    const botY = headlen * Math.sin(angle2); // P4点的Y轴坐标

    const context = this.context;

    // 开始绘制
    context.save();
    context.beginPath();

    // P3的坐标位置
    let arrowX = mouseStartX - topX;
    let arrowY = mouseStartY - topY;

    // 移动笔触到P3坐标
    context.moveTo(arrowX, arrowY);
    // 移动笔触到P1
    context.moveTo(mouseStartX, mouseStartY);
    // 绘制P1到P2的直线
    context.lineTo(mouseX, mouseY);
    // 计算P3的位置
    arrowX = mouseX + topX;
    arrowY = mouseY + topY;
    // 移动笔触到P3坐标
    context.moveTo(arrowX, arrowY);
    // 绘制P2到P3的斜线
    context.lineTo(mouseX, mouseY);
    // 计算P4的位置
    arrowX = mouseX + botX;
    arrowY = mouseY + botY;
    // 绘制P2到P4的斜线
    context.lineTo(arrowX, arrowY);
    // 上色
    context.strokeStyle = color;
    context.lineWidth = borderWidth;
    // 填充
    context.stroke();
    // 结束绘制
    context.restore();
  }

  drawText = (
    text,
    mouseX,
    mouseY,
    color,
    fontSize
  ) => {
    const context = this.context;
    // 开始绘制
    context.save();
    context.lineWidth = 1;
    // 设置字体颜色
    context.fillStyle = color;
    context.textBaseline = 'middle';
    context.font = `bold ${fontSize}px 微软雅黑`;
    context.fillText(text, mouseX, mouseY);
    // 结束绘制
    context.restore();
  }

   addHistory = () => {
     // 获取canvas画布与容器
     const context = this.context;
     if (this.history.length > this.maxUndoNum) {
       // 删除最早的一条画布记录
       this.history.shift();
     }
     // 保存当前画布状态
     this.history.push({
       data: context.getImageData(0, 0, this.graphData.width, this.graphData.height)
     });
   }

   showLastHistory() {
     const context = this.context;
     if (this.history.length <= 0) {
       this.addHistory();
     }
     context.putImageData(this.history[this.history.length - 1]['data'], 0, 0);
   }

   takeOutHistory() {
     const lastImageData = this.history.pop();
     if (lastImageData) {
       const context = this.context;
       context.putImageData(lastImageData['data'], 0, 0);
     }

     this.undoClickNum++;
     // 历史记录已取完，禁用撤回按钮点击
     if (this.history.length <= 0) {
       this.undoClickNum = 0;
     }
   }

   clearHistory() {
     this.history = [];
     this.context.clearRect(0, 0, this.graphData.width, this.graphData.height);
     this.textInputController.innerText = '';
     this.textInputController.style.visibility = 'hidden';
   }

  destroy = () => {
    this.controller && this.controller.removerEventListener('mousedown', this.mouseDownEvent);
    this.controller && this.controller.removerEventListener('mousemove', this.mouseMoveEvent);
    this.controller && this.controller.removerEventListener('mouseup', this.mouseUpEvent);
    this.controller = null;
  };
}

function throttle(func, wait) {
  let timeout = null;
  return function() {
    const context = this;
    const args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}
