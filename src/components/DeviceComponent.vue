<template>
    <div class="device col s12 m6">
      <div class="card">
        <div class="card-content">
          <span class="card-title">{{ name }}</span>
          <p v-if="type == 'switch'"><i class="material-icons large">power</i></p>
          <p v-if="type == 'light'"><i class="material-icons large">lightbulb_outline</i></p>
        </div>
      </div>
    </div>
</template>

<script>

export default {
    name: 'Device',
    props: {
        id: String,
        name: String,
        type: String,
        data: Object,
    },
    data() {
        return {
            
        }
    }
}
</script>

<style scoped>

</style>