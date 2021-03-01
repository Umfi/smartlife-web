<template>
    <div>
      <div class="device col s12 m6">
        <div class="card">
          <div class="card-content">
            <span class="card-title">{{ name }} <i v-if="type == 'light'" class="material-icons right" @click="adjustLightDetails">settings</i></span>
            <div class="row valign-wrapper">
                <div class="col s6">
                  <p v-if="type == 'switch'"><i class="material-icons large">power</i></p>
                  <p v-if="type == 'light'"><i class="material-icons large">lightbulb_outline</i></p>
                </div>
                <div class="col s6">
                  <div class="switch">
                    <label>
                      Off
                      <input type="checkbox" v-model="state" @change="toggleDeviceState">
                      <span class="lever"></span>
                      On
                    </label>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <!-- Modal Structure -->
      <div class="modal" v-bind:data-id="id">
        <div class="modal-content">
          <h4>Adjust Light</h4>
           <br>

           <div class="row">
             <h5>Mode</h5>
           </div>
           <div class="row">
              <div class="col s12">
                  <label>
                    <input v-model="mode" @change="changeLightMode" type="radio" value="white"  />
                    <span>White</span>
                  </label>
                  <label class="ml5">
                    <input v-model="mode" @change="changeLightMode" type="radio" value="colour" />
                    <span>Color</span>
                  </label>
              </div>
           </div>
           <div v-if="mode === 'white'">
            <div class="row">
              <h5>Brightness</h5>
            </div>
            <div class="row valign-wrapper">
                <div class="col s1">
                  <i class="material-icons">brightness_low</i>
                </div>
                <div class="range-field col s10">
                    <input type="range" min="25" max="255" v-model="brightness" @change="adjustBrightness" />
                </div>
                <div class="col s1">
                  <i class="material-icons">brightness_high</i>
                </div>
            </div>
            <div class="row">
              <h5>Color Temperature</h5>
            </div>
            <div class="row valign-wrapper">
              <div class="col s1">
                <i class="material-icons">cloud_queue</i>
              </div>
              <div class="range-field col s10">
                  <input type="range" min="1000" max="10000" v-model="colorTemperature" @change="adjustColorTemperature" />
              </div>
              <div class="col s1">
                <i class="material-icons">wb_sunny</i>
              </div>
            </div>
          </div>
          <div v-if="mode === 'colour'">
            <div class="row">
              <h5>Color</h5>
            </div>
            <div class="row">
                <div class="range-field">
                  <slider-picker v-model="color" @input="adjustColor" class="col s12"/>
                </div>
             </div>
             <div class="row">
              <h5>Brightness</h5>
            </div>
            <div class="row valign-wrapper">
                <div class="col s1">
                  <i class="material-icons">brightness_low</i>
                </div>
                <div class="range-field col s10">
                    <input type="range" min="25" max="255" v-model="brightness" @change="adjustBrightness" />
                </div>
                <div class="col s1">
                  <i class="material-icons">brightness_high</i>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

import { toggleDevice, adjustBrightness, adjustColorTemperature, adjustColor } from "../service/DeviceService.js";
import M from 'materialize-css'
import SliderPicker from 'vue-color/src/components/Slider'

export default {
    name: 'Device',
    props: {
        id: String,
        name: String,
        type: String,
        devtype: String,
        data: Object,
    },
    components: {
      'slider-picker': SliderPicker
    },
    data() {
        return {
            timeout: null,
            state: false,
            mode: 'white',
            brightness: 25,
            colorTemperature: 1000,
            color: { h: 150, s: 0.66, v: 0.30 }
        }
    },
    mounted() {
      let curState = this.$props.data.state;
      if (curState === "false") {
        curState = false;
      } else if(curState === "true") {
        curState = true;
      }

      this.state = curState;

      // Init mode
      if (this.$props.data.color_mode) {
        this.mode = this.$props.data.color_mode;
      }

      // Init brightness
      if (this.$props.data.brightness) {
        this.brightness = parseInt(this.$props.data.brightness);
      }

      // Init brightness
      if (this.$props.data.color_temp) {
        this.colorTemperature = parseInt(this.$props.data.color_temp);
      }

      // Init color
      if (this.$props.data.color) {
        this.color = this.$props.data.color;
      }

      // Init Materialize Components
      var elems = document.querySelectorAll('.modal');
      M.Modal.init(elems);

      var ranges = document.querySelectorAll("input[type=range]");
      M.Range.init(ranges);
    },
    methods: {
      async toggleDeviceState() {
        const result = await toggleDevice(this.$props.id, this.state, this.$props.devtype);
        if (!result) {
          M.toast({html: 'Could not toggle the device state!'});
        }
      },
      adjustLightDetails() {
        var elem = document.querySelector('.modal[data-id="' + this.$props.id + '"]');
        var instance = M.Modal.getInstance(elem);
        instance.open();
      },
      async changeLightMode() {
        if (this.mode == "white") {
          this.colorTemperature = 10000;
          this.brightness = 255;
          await this.adjustColorTemperature();
          await this.adjustBrightness();
        } else {
          this.color.hsv = { h: 150, s: 0.66, v: 0.30 }
          this.brightness = 255;
          await this.adjustColor();
          await this.adjustBrightness();
        }
      },
      async adjustBrightness() {
        const result = await adjustBrightness(this.$props.id, this.brightness);
        if (!result) {
          M.toast({html: 'Could not adjust the brightness of the device!'});
        }
      },
      async adjustColorTemperature() {
        const result = await adjustColorTemperature(this.$props.id, this.colorTemperature);
        if (!result) {
          M.toast({html: 'Could not adjust the color temperature of the device!'});
        }
      },
      async adjustColor() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout( async () => {

            const result = await adjustColor(this.$props.id, this.color.hsv);
            if (!result) {
              M.toast({html: 'Could not adjust the color of the device!'});
            }

        }, 250);
      }
    }
}
</script>

<style scoped>
.ml5 {
  margin-left: 5%;
}
</style>