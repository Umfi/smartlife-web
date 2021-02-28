<template>
    <div class="device col s12 m6">
      <div class="card">
        <div class="card-content">
          <span class="card-title">{{ name }}</span>
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
</template>

<script>

import { toggleDevice } from "../service/DeviceService.js";
import M from 'materialize-css'

export default {
    name: 'Device',
    props: {
        id: String,
        name: String,
        type: String,
        devtype: String,
        data: Object,
    },
    data() {
        return {
            state: false
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
    },
    methods: {
      async toggleDeviceState() {
        const result = await toggleDevice(this.$props.id, this.state, this.$props.devtype);
        if (!result) {
          M.toast({html: 'Could not toggle the device state!'});
        }
      }
    }
}
</script>

<style scoped>

</style>