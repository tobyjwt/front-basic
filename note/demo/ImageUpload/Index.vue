<template>
  <div class="image-upload">
    <div
      v-for="(item, index) in localImageList"
      :key="item.src"
      class="flex-item image-wrap"
      @mouseover="onMouseOver(item)"
      @mouseout="onMouseOut(item)"
    >
      <img class="image" :src="item.src" alt="">
      <div
        v-show="item.showTool"
        class="tool-wrap"
      >
        <span
          class="tool-icon"
          @click="handlePreview(item.src)"
        >
          <i class="el-icon-zoom-in" />
        </span>
        <span
          class="tool-icon"
          @click="handleRemove(index)"
        >
          <i class="el-icon-delete" />
        </span>
      </div>
    </div>
    <div
      v-show="value.length < max"
      class="flex-item add-wrap"
      @mouseover="isAddMouseOver = true;"
      @mouseout="isAddMouseOver = false;"
    >
      <span
        v-show="!isAddMouseOver"
        class="tool-icon"
        @click="handlePreview()"
      >
        <i class="el-icon-plus" />
      </span>
      <span
        v-show="isAddMouseOver"
      >
        <el-button
          type="primary"
          @click="cameraVisible = true;"
        >拍照</el-button>
      </span>
      <span
        v-show="isAddMouseOver"
      >
        <el-upload
          class="upload-button"
          multiple
          action="#"
          :auto-upload="false"
          :file-list="localImageList.map(item => ({name: item.src, url: item.src }))"
          :limit="max"
          :on-exceed="handleExceed"
          :show-file-list="false"
          :on-change="changeHandler"
        >
          <el-button
            type="primary"
          >上传图片</el-button>
        </el-upload>
      </span>
    </div>
    <el-dialog :visible.sync="previewVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <Camera :visible.sync="cameraVisible" @on-confirm-photo="handleConfirmPhoto" />
  </div>
</template>
<script>
import Camera from './Camera';
import uploadImg from '@/mixins/uploadImg';
import { Button } from 'element-ui'; // el-button被全局改写，form表单enter会触发这里的click事件，原因可能和组件嵌套有关，先这样解决

export default {
  name: 'ImageUpload',
  components: {
    Camera,
    'el-button': Button
  },
  mixins: [uploadImg],
  props: {
    max: {
      type: Number,
      default: 5
    },
    value: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      localImageList: this.value.map(item => ({
        src: item,
        showTool: false
      })),
      dialogImageUrl: false,
      previewVisible: false,

      showAdd: true,
      isAddMouseOver: false,

      cameraVisible: false
    };
  },
  watch: {
    value(val) {
      this.localImageList = val.map(item => ({
        src: item,
        showTool: false
      }));
    }
  },
  methods: {
    onMouseOver(item) {
      item.showTool = true;
    },
    onMouseOut(item) {
      item.showTool = false;
    },
    handlePreview(src) {
      this.dialogImageUrl = src;
      this.previewVisible = true;
    },
    handleRemove(index) {
      this.value.splice(index, 1);
    },

    changeHandler(file) {
      if (this.localImageList.length >= this.max) { // 兜底
        this.$message.error('图片数量超出限制');
        return ;
      }
      if (!file) return;
      const { raw } = file;
      this.handleImgUpload(raw, (url) => {
        if (url) {
          this.addImage(url);
        }
      }, { maxSize: 50, square: false });
    },

    handleConfirmPhoto(file) {
      this.handleImgUpload(file, (url) => {
        if (url) {
          this.addImage(url);
        }
      }, { maxSize: 50, square: false });
    },

    addImage(url) {
      this.value.push(url);
      if (this.value.length >= this.max) {
        this.cameraVisible = false;
      }
    },

    handleExceed(file, fileList) {
      this.$message.error('超出数量限制');
    }
  }
};
</script>
<style lang='scss' scoped>
.image-upload {
  display: flex;

  .flex-item {
    flex: 0 0 140px;
    width: 140px;
    height: 140px;
    margin-right: 6px;
    position: relative;
  }

  .image-wrap {
    border: 1px solid #c0ccda;
    border-radius: 6px;

    .image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .tool-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 26px;
    color: white;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;

    .tool-icon {
      cursor: pointer;
    }
  }

  .add-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
  }
}
</style>
