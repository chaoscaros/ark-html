<template>
  <el-row :span="24" v-show="ShowCaptcha2" @touchend="remove">
    <el-col :span="24">
      <el-card style="max-width: 510px; justify-content: center; margin: auto">
        <template #header>
          <div class="card-header">
            <span>请完成安全验证</span>
          </div>
        </template>
        <div class="card-body">
          <el-row class="demo-autocomplete">
            <el-col>
              <div
                style="width: 272px; width: 272px; height: 169px; margin: auto"
              >
                <div id="captchaTip">
                  <img id="cpcImg" :src="imgUrl" @click="captchaTipclick" />
                  <div
                    class="radio"
                    v-for="item in pointlist"
                    :key="item.tipIndex"
                    v-bind:style="{
                      left: item.left + 'px',
                      top: item.top + 'px',
                    }"
                  >
                    {{ item.tipIndex }}
                  </div>
                </div>
              </div>
              <img id="cpcTipImg" :src="imgUrl2" width="275" />
            </el-col>
          </el-row>
          <el-button type="primary" size="medium" round @click="cap2click"
            >确认</el-button
          >
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :span="24" v-show="!ShowCaptcha2" @touchend="remove">
    <el-col :span="24">
      <el-card style="max-width: 510px; justify-content: center; margin: auto">
        <div class="card-body">
          <el-result   v-show="!ShowOK" icon="error" title="错误" :sub-title="message"></el-result>
           <el-result   v-show="ShowOK" icon="success" title="成功" :sub-title="message"></el-result>
        </div>
      </el-card>
    </el-col>
  </el-row>
 
</template>
<style>
#captchaTip .radio {
  background-color: #ecf5ff;
  border-color: #d9ecff;
  color: #409eff;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
  position: absolute;
  z-index: 10;
}
</style>
<script>
import { onMounted, reactive, toRefs } from "vue";
//  import { useRouter } from "vue-router";VerifyCaptcha2
import { ElLoading } from "element-plus";
import { GetVerifyCaptchabyPhone, VerifyCaptcha2 } from "@/api/index";
import { ElMessage } from "element-plus";
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    // const router = useRouter()

    let data = reactive({
      imgUrl: "",
      imgUrl2: "",
      ShowCaptcha2: true,
      ShowOK:false,
      message: "访问错误",
      pointlist:[],
    });
    const getInfo = async () => {
    // ElMessage.success(props.id);
      if (props.id == "") {
        data.ShowCaptcha2 = false;
        return false;
      }
      const body = await GetVerifyCaptchabyPhone( props.id );
      data.ShowCaptcha2 = body.success;
      if (!body.success) {
        data.message = body.message;
        return false;
      }
       data.imgUrl = "data:image/png;base64," + body.data.big;

          data.imgUrl2 =
            "data:image/png;base64," + body.data.small;
    };

    onMounted(getInfo);
    const cap2click = async () => {
      if (data.pointlist.length != 4) return;
      const loading = ElLoading.service({
        lock: true,
        text: "验证中请稍候..",
      });
      var arr = [];
      data.pointlist.forEach((element) => {
        arr.push({
          tipIndex: element.tipIndex,
          offsetX: element.offsetX,
          offsetY: element.offsetY,
        });
      });
      const VerifyCaptchadata2 = await VerifyCaptcha2({
        Phone: props.id,
        point: arr,
      });
      loading.close();
      if (VerifyCaptchadata2.success) {
        ElMessage.success("认证成功");
         data.ShowCaptcha2 = false;
         data.message = "请返回机器人输入验证码!";
           data.ShowOK=true;
        return true;
      } else {
        data.pointlist = [];
        if (VerifyCaptchadata2.data.status == 666) {
          ElMessage.error("验证失败,请重试");
          data.imgUrl = "data:image/png;base64," + VerifyCaptchadata2.data.big;

          data.imgUrl2 =
            "data:image/png;base64," + VerifyCaptchadata2.data.small;
        } else {
          data.ShowCaptcha2 = false;
          ElMessage.error(VerifyCaptchadata2.message);
          return false;
        }
      }
    };
     const captchaTipclick = (event) => {
      if (data.pointlist.length == 4) return;
      var tipIndex = data.pointlist.length + 1;
      var left = event.currentTarget.offsetLeft + event.offsetX - 15;
      var top = event.currentTarget.offsetTop + event.offsetY - 15;
      console.log({ tipIndex: tipIndex, left: left, top: top });
      data.pointlist.push({
        tipIndex: tipIndex,
        left: left,
        top: top,
        offsetX: event.offsetX,
        offsetY: event.offsetY,
      });
    };
    return {
      ...toRefs(data),
      getInfo,
      cap2click,
      captchaTipclick
    };
  },
};
</script>

