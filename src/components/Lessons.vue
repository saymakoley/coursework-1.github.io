<template>
    <div>
        <section
        class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-6 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8 items-start"
        
      >
        <div class="w-full sm:w-1/5 space-y-6">
          <input
            type="text"
            class="p-2 border w-full"
            placeholder="Search lessons"
            v-model="search"
          />

          <div class="space-y-2">
            <p class="font-semibold text-blue-700">Filter:</p>

            <div>
              <input
                type="radio"
                name="sortBy"
                id="subject"
                value="subject"
                v-model="sortOption"
              />
              <label for="subject">Subject</label>
            </div>
            <div>
              <input
                type="radio"
                name="sortBy"
                id="location"
                value="location"
                v-model="sortOption"
              />
              <label for="location">Location</label>
            </div>
            <div>
              <input
                type="radio"
                name="sortBy"
                id="price"
                value="price"
                v-model="sortOption"
              />
              <label for="price">Price</label>
            </div>
            <div>
              <input
                type="radio"
                name="sortBy"
                id="availability"
                value="availability"
                v-model="sortOption"
              />
              <label for="availability">Availability</label>
            </div>
          </div>

          <div class="space-y-2">
            <p class="font-semibold text-blue-700">Order:</p>

            <div>
              <input
                type="radio"
                name="orderBy"
                id="ascending"
                value="ascending"
                v-model="orderOption"
              />
              <label for="ascending">Ascending</label>
            </div>
            <div>
              <input
                type="radio"
                name="orderBy"
                id="descending"
                value="descending"
                v-model="orderOption"
              />
              <label for="descending">Descending</label>
            </div>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:w-4/5 w-full">
          <div
            class="border border-gray-200 rounded"
            v-for="lesson in modifiedLessons"
            :key="lesson.id"
          >
            <img
              v-bind:src="`https://sayma-cw2.onrender.com/images/${lesson.image}`"
              class="w-full h-40"
              v-bind:alt="lesson.subject"
            />
            <div class="p-4">
              <p>
                <strong>Subject: </strong>
                {{ lesson.subject }}
              </p>
              <p>
                <strong>Location: </strong>
                {{ lesson.location }}
              </p>
              <p>
                <strong>Price: </strong>
                £{{ lesson.price }}
              </p>
              <p>
                <strong>Spaces: </strong>
                {{ lesson.spaces }}
              </p>

              <button
                class="bg-blue-700 p-2 text-white rounded !mt-4 disabled:opacity-20"
                v-bind:disabled="lesson.spaces == 0"
                v-on:click="addItemToCart(lesson._id)"
              >
                <span v-if="lesson.spaces > 0">Add to cart</span>
                <span v-else>Out of stock</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>

<script>
export default {
    name: 'Lessons',

    data() {
        return {
            
        };
    },

    mounted() {
        
    },

    methods: {
        
    },
};
</script>