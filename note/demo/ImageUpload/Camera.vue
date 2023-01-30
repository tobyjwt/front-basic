<template>
  <el-dialog
    :visible.sync="visible"
    :width="width + 40 + 'px'"
    :before-close="() => $emit('update:visible', false)"
  >
    <div class="camera-container">
      <video v-show="!isTaken" ref="video" class="video" autoplay />
      <canvas v-show="isTaken" ref="canvas" :width="width" :height="height" class="canvas" />
      <canvas v-show="isTaken" ref="toolCanvas" :width="width" :height="height" class="toolCanvas" />
      <div
        id="textInputPanel"
        ref="textInputController"
        class="input-panel"
        contenteditable="true"
        spellcheck="false"
      />
    </div>

    <div class="tool-wrap">
      <span
        v-show="!isTaken"
        class="tool-icon"
        @click="handleTake"
      >
        <i class="el-icon-camera" />
      </span>
      <span
        v-show="isTaken"
        class="tool-icon icon-close"
        @click="handleCancel"
      >
        <i class="el-icon-circle-close" />
      </span>

      <div
        v-show="isTaken"
        class="panel-wrap"
      >
        <div
          v-for="key in TOOL_MAP"
          :key="key"
          :class="getClassName(key)"
          class="panel-item"
          @click="handleClickPanel(key)"
        />
        <div
          class="panel-item undo"
          @click="handleUndo"
        />
      </div>

      <span
        v-show="isTaken"
        class="tool-icon icon-check"
        @click="handleConfirm"
      >
        <i class="el-icon-circle-check" />
      </span>
    </div>
  </el-dialog>
</template>
<script>
import CameraTool, { TOOL_MAP } from './tools';

export default {
  name: 'Camera',
  mixins: [],
  props: {
    visible: Boolean,
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 400
    }
  },
  data: () => ({
    isTaken: false,
    TOOL_MAP,
    activePanel: ''
  }),
  watch: {
    visible(val) {
      if (val) {
        this.init();
        this.$nextTick(() => {
          if (!this.cameraTool) {
            const { toolCanvas, textInputController } = this.$refs;
            this.cameraTool = new CameraTool(toolCanvas, this.width, this.height, textInputController);
          }
        });
      } else {
        this.stopVideoStream();
        this.cameraTool && this.cameraTool.clearHistory();
      }
    }
  },
  mounted() {
  },
  methods: {
    async init() {
      this.stopVideoStream();
      this.isTaken = false;
      if (
        !('mediaDevices' in navigator) ||
        !('getUserMedia' in navigator.mediaDevices)
      ) {
        this.$message.error('当前浏览器不支持Camera API，请更换或升级浏览器');
        return;
      }
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: {
              min: this.width,
              ideal: this.width,
              max: this.width
            },
            height: {
              min: this.height,
              ideal: this.height,
              max: this.height
            }
          }
        });
        this.$refs.video.srcObject = this.videoStream;
      } catch (error) {
        console.log('try use mediaDevices error, ', error);
      }
    },

    stopVideoStream() { // 停止视频流
      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    },

    handleTake() {
      const { canvas, video } = this.$refs;
      canvas.getContext('2d').drawImage(video, 0, 0);
      this.isTaken = true;
    },

    handleCancel() {
      this.isTaken = false;
      this.cameraTool.clearHistory();
      this.activePanel = '';
    },

    handleUndo() {
      this.cameraTool.takeOutHistory();
    },

    getClassName(key) {
      return key === this.activePanel ? `${key}-active` : key;
    },

    handleClickPanel(key) {
      this.activePanel = key;
      this.cameraTool.setToolName(key);
    },

    handleConfirm() {
      const { canvas, toolCanvas } = this.$refs;
      canvas.getContext('2d').drawImage(toolCanvas, 0, 0);
      const file = this.dataURLtoFile(canvas.toDataURL('image/png'), `${Date.now()}.png`);
      this.$emit('on-confirm-photo', file);
      this.isTaken = false;
      this.activePanel = '';
      this.cameraTool.clearHistory();
    },

    dataURLtoFile(dataurl, filename) { // 将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
      var arr = dataurl.split(','); var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]); var n = bstr.length; var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      this.fileList = new File([u8arr], filename, { type: mime });
      return new File([u8arr], filename, { type: mime });
    }
  }
};
</script>
<style lang='scss' scoped>
.camera {
}
.camera-container {
  position: relative;

  .toolCanvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}

.tool-wrap {
  font-size: 48px;
  display: flex;
  justify-content: space-around;
  .tool-icon {
    cursor: pointer;
  }

  .tool-icon:hover {
    color: #409EFF;
  }

  .icon-check {
    color: #67C23A;
  }

  .icon-close {
    color: #F56C6C;
  }
}

.panel-wrap {
  display: flex;
  align-items: center;

  .panel-item {
    width: 24px;
    height: 24px;
    margin-right: 15px;
    font-size: 12px;
    background-repeat: no-repeat;
    background-size: contain;

    &:last-child {
      margin-right: 0;
    }
  }

  .arrow {
    background-image: url("~@/assets/camera_tool/arrow.png");
  }

  .arrow-active {
    background-image: url("~@/assets/camera_tool/arrow-click.png");
  }

  .circle {
    background-image: url("~@/assets/camera_tool/circle.png");
  }

  .circle-active {
    background-image: url("~@/assets/camera_tool/circle-click.png");
  }

  .text {
    background-image: url("~@/assets/camera_tool/text.png");
  }

  .text-active {
    background-image: url("~@/assets/camera_tool/text-click.png");
  }

  .undo {
    background-image: url("~@/assets/camera_tool/undo.png");
  }
}

.input-panel {
  min-width: 20px;
  min-height: 30px;
  line-height: 30px;
  padding: 5px;
  box-sizing: border-box;
  position: absolute;
  outline: none;
  top: 0;
  left: 0;
  color: red;
  border: solid 1px red;
  font-size: 12px;
  visibility: hidden;
}
</style>
