<template>
  <div id="app">
    <h1 class="text-blue-700 text-4xl">This is trghe header</h1>

    <!-- Navigation -->
    <nav class="bg-blue-700">
            <div
              class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
            >
              <a
                href="/"
                class="text-white font-semibold text-3xl"
                style="font-family: cursive"
              >
                Coursework 1
              </a>
    
              <button
                v-on:click="showCart = !showCart"
                class="flex items-center space-x-2"
                v-bind:class="[noOfItemsInCart == 0 ? 'text-gray-400' : 'text-white']"
                v-bind:disabled="noOfItemsInCart == 0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
    
                <span>{{ noOfItemsInCart }}</span>
              </button>
            </div>
          </nav>

  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      cart: [],
      showCart: false,
    }
  },
  computed: {
    noOfItemsInCart() {
      if (this.cart.length > 0) {
        return this.cart.reduce((total, item) => total + item.spaces, 0);
      } else {
        return 0;
      }
    },
  }
}
</script>

<style>

</style>
