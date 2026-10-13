<template>
  <div>
    <VueEditor @ready="editorReady"></VueEditor>
  </div>
</template>

<script>
import VueEditor from "@/components/Ueditor/BaseUEditor";

export default {
  data: function () {
    return {
      editorInstance: null,
    };
  },
  components: {
    VueEditor,
  },
  methods: {
    editorReady(editorInstance) {
      this.editorInstance = editorInstance;
      editorInstance.setContent(this.defaultMes);
      editorInstance.setHeight(this.height);
      editorInstance.addListener("contentChange", () => {
        this.$emit("editModel", editorInstance.getContent());
      });
    },
    setContent(value) {
      if (this.editorInstance) {
        this.editorInstance.setContent(value);
      }
    },
    getContent() {
      return this.editorInstance.getContent();
    },
  },
  props: {
    defaultMes: { default: "" },
    height: { default: 400 },
  },
  created() {
    process.env.NODE_ENV === "development"
      ? (window.UEDITOR_HOME_URL = "/static/ueditor1_4_3_3/")
      : (window.UEDITOR_HOME_URL = "./static/ueditor1_4_3_3/");
  },
};
</script>
<style>
.edui-button.edui-for-135editor .edui-button-wrap .edui-button-body .edui-icon {
  background-image: url("https://cdnfile-10043692.file.myqcloud.com/httpsresources/editor-135-icon.png") !important;
  background-size: 85%;
  background-position: center;
  background-repeat: no-repeat;
}
.edui-button.edui-for-xiumi .edui-button-wrap .edui-button-body .edui-icon {
  background-image: url("https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/richtext/xiumi-icon.jpg") !important;
  background-size: 85%;
  background-position: center;
  background-repeat: no-repeat;
}
.edui-default .edui-for-videojs .edui-icon {
  background-position: -320px -20px;
}
.edui-default .edui-for-audiojs .edui-icon {
  background-position: -20px -40px;
}

.edui-default .edui-for-videojs .edui-dialog-content,
.edui-default .edui-for-audiojs .edui-dialog-content {
  width: 600px;
  height: 460px;
  overflow: hidden;
  background-position: -320px -20px;
}
.edui-for-xiumi .edui-dialog-content {
  width: 1150px;
  height: 690px;
}
</style>
