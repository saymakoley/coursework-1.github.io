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
                    :value="search"
                    @input="$emit('update:search', $event.target.value)"
                />

                <div class="space-y-2">
                    <p class="font-semibold text-blue-700">Filter:</p>

                    <div class="space-x-2">
                        <input
                            type="radio"
                            name="sortBy"
                            id="subject"
                            value="subject"
                            :checked="'subject' === sortOption"
                            @change="
                                $emit('update:sortOption', $event.target.value)
                            "
                        />
                        <label for="subject">Subject</label>
                    </div>
                    <div class="space-x-2">
                        <input
                            type="radio"
                            name="sortBy"
                            id="location"
                            value="location"
                            :checked="'location' === sortOption"
                            @change="
                                $emit('update:sortOption', $event.target.value)
                            "
                        />
                        <label for="location">Location</label>
                    </div>
                    <div class="space-x-2">
                        <input
                            type="radio"
                            name="sortBy"
                            id="price"
                            value="price"
                            :checked="'price' === sortOption"
                            @change="
                                $emit('update:sortOption', $event.target.value)
                            "
                        />
                        <label for="price">Price</label>
                    </div>
                    <div class="space-x-2">
                        <input
                            type="radio"
                            name="sortBy"
                            id="availability"
                            value="availability"
                            :checked="'availability' === sortOption"
                            @change="
                                $emit('update:sortOption', $event.target.value)
                            "
                        />
                        <label for="availability">Availability</label>
                    </div>
                </div>

                <div class="space-y-2">
                    <p class="font-semibold text-blue-700">Order:</p>

                    <div class="space-x-2">
                        <input
                            type="radio"
                            name="orderBy"
                            id="ascending"
                            value="ascending"
                            :checked="'ascending' === orderOption"
                            @change="
                                $emit('update:orderOption', $event.target.value)
                            "
                        />
                        <label for="ascending">Ascending</label>
                    </div>
                    <div class="space-x-2">
                        <input
                            type="radio"
                            name="orderBy"
                            id="descending"
                            value="descending"
                            :checked="'descending' === orderOption"
                            @change="
                                $emit('update:orderOption', $event.target.value)
                            "
                        />
                        <label for="descending">Descending</label>
                    </div>
                </div>
            </div>

            <div
                class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:w-4/5 w-full"
            >
                <div
                    class="border border-gray-200 rounded"
                    v-for="lesson in lessons"
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
                        <br />
                        <button
                            class="bg-blue-700 p-2 text-white rounded !mt-8 disabled:opacity-20"
                            v-bind:disabled="lesson.spaces == 0"
                            v-on:click.prevent="
                            $emit('addItemToCart', lesson._id)
                        "
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
    name: "Lessons",

    props: {
        lessons: {
            type: [Object, Array],
            required: true,
        },
        search: {
            type: String,
            required: true,
        },
        sortOption: {
            type: String,
            required: true,
        },
        orderOption: {
            type: String,
            required: true,
        },
    },

    mounted() {},

    methods: {},
};
</script>