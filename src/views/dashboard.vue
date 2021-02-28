<template>
    <div id="dashboard">
        <h1>Devices</h1>
        
        <div class="row">
            <device   
                v-for="device in devices"
                v-bind:key="device.id"
                v-bind:id="device.id"
                v-bind:name="device.name"
                v-bind:type="device.ha_type"
                v-bind:data="device.data">
            </device>
        </div>
    </div>
</template>

<script>

import { getDevices } from "../service/DeviceService.js";

export default {
    name: 'Dashboard',
    data() {
        return {
            devices: []
        }
    },
    async mounted() {
        this.devices = await getDevices();
    },
}
</script>

<style scoped>

</style>