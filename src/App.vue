<template>
    <!-- Root Component -->
    <div id="app">
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

                <!-- Cart button that switches between Lessons and Checkout -->
                <button
                    v-on:click="showCart = !showCart"
                    class="flex items-center space-x-2"
                    v-bind:class="[
                        noOfItemsInCart == 0 ? 'text-gray-400' : 'text-white',
                    ]"
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

        <!-- 
            * make use of lessons component 
            * pass lessons gotten from API as prop to component - :lessons="modifiedLessons"
        -->
        <Lessons
            v-if="!showCart"
            :lessons="modifiedLessons"
            v-model:sort-option="sortOption"
            v-model:order-option="orderOption"
            v-model:search="search"
            @addItemToCart="addItemToCart"
        />

        <!-- 
            * make use of checkout component 
            * pass shopping cart to component - :cart="cart"
        -->
        <Checkout
            v-else
            :cart="cart"
            @removeItemFromCart="removeItemFromCart"
            @checkout="checkout"
        />
    </div>
</template>

<script> 
import Lessons from "./components/Lessons.vue"; // import lessons component from the components directory
import Checkout from "./components/Checkout.vue"; // import checkout component from the components directory
export default {
    name: "App",
    components: {
        Lessons, // register lessons component
        Checkout, // register checkout component
    },
    data() {
        return {
            search: "",
            sortOption: "subject",
            orderOption: "ascending",
            lessons: [], // lessons data property
            cart: [], // shopping cart
            showCart: false,
        };
    },
    methods: {
        // function to addItemToCart when event is triggered from the lessons component with the lessons id to add to cart
        addItemToCart(_id) {
            const lesson = this.lessons.find(function (lesson) {
                if (lesson._id === _id) {
                    return true;
                } else {
                    return false;
                }
            });

            const isLessonInCart = !!this.cart.find(function (cartItem) {
                return cartItem._id === _id;
            });

            if (lesson.spaces > 0) {
                if (!isLessonInCart) {
                    this.cart.push({
                        _id: lesson._id,
                        subject: lesson.subject,
                        location: lesson.location,
                        price: lesson.price,
                        image: lesson.image,
                        spaces: 1,
                    });
                } else {
                    this.cart = this.cart.map(function (cartItem) {
                        if (cartItem._id === lesson._id) {
                            return {
                                _id: cartItem._id,
                                subject: cartItem.subject,
                                location: cartItem.location,
                                price: cartItem.price,
                                image: cartItem.image,
                                spaces: ++cartItem.spaces,
                            };
                        } else {
                            return cartItem;
                        }
                    });
                }

                // decrease lesson spaces
                this.lessons = this.lessons.map(function (lessonItem) {
                    if (
                        lessonItem.spaces > 0 &&
                        lessonItem._id === lesson._id
                    ) {
                        return {
                            _id: lessonItem._id,
                            subject: lessonItem.subject,
                            location: lessonItem.location,
                            price: lessonItem.price,
                            image: lessonItem.image,
                            spaces: --lessonItem.spaces,
                        };
                    } else {
                        return lessonItem;
                    }
                });
            }
        },

        removeItemFromCart(_id) {
            const index = this.cart.findIndex(function (cartItem) {
                return cartItem._id === _id;
            });

            this.cart.splice(index, 1);

            this.lessons = this.lessons.map(function (lessonItem) {
                if (lessonItem._id === _id) {
                    return {
                        _id: lessonItem._id,
                        subject: lessonItem.subject,
                        location: lessonItem.location,
                        price: lessonItem.price,
                        image: lessonItem.image,
                        spaces: 5,
                    };
                } else {
                    return lessonItem;
                }
            });

            if (this.cart.length == 0) {
                this.showCart = false;
            }
        },

        checkout() {
            this.cart.forEach(async (item) => {
                // create order
                await fetch("https://sayma-coursework-2.herokuapp.com/order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: this.name,
                        phone: this.phone,
                        lesson_id: item._id,
                        spaces: item.spaces,
                    }),
                });

                // update spaces
                await fetch(
                    "https://sayma-coursework-2.herokuapp.com/lesson/" + item._id,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            spaces: item.spaces,
                        }),
                    }
                );
            });

            alert("Checked out successfully");

            this.cart = [];

            this.showCart = false;
        },
    },
    computed: {
        noOfItemsInCart() {
            if (this.cart.length > 0) {
                return this.cart.reduce(
                    (total, item) => total + item.spaces,
                    0
                );
            } else {
                return 0;
            }
        },

        modifiedLessons() {
            const lessons = this.lessons;

            if (this.orderOption === "ascending") {
                if (this.sortOption === "subject") {
                    return lessons.sort(function (a, b) {
                        if (a.subject.toLowerCase() > b.subject.toLowerCase()) {
                            return 1;
                        } else if (
                            a.subject.toLowerCase() < b.subject.toLowerCase()
                        ) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                } else if (this.sortOption === "location") {
                    return lessons.sort(function (a, b) {
                        if (
                            a.location.toLowerCase() > b.location.toLowerCase()
                        ) {
                            return 1;
                        } else if (
                            a.location.toLowerCase() < b.location.toLowerCase()
                        ) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                } else if (this.sortOption === "price") {
                    return lessons.sort(function (a, b) {
                        if (a.price > b.price) {
                            return 1;
                        } else if (a.price < b.price) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                } else if (this.sortOption === "availability") {
                    return lessons.sort(function (a, b) {
                        if (a.spaces > b.spaces) {
                            return 1;
                        } else if (a.spaces < b.spaces) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                }
            } else if (this.orderOption === "descending") {
                if (this.sortOption === "subject") {
                    return lessons.sort(function (a, b) {
                        if (a.subject.toLowerCase() > b.subject.toLowerCase()) {
                            return -1;
                        } else if (
                            a.subject.toLowerCase() < b.subject.toLowerCase()
                        ) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                } else if (this.sortOption === "location") {
                    return lessons.sort(function (a, b) {
                        if (
                            a.location.toLowerCase() > b.location.toLowerCase()
                        ) {
                            return -1;
                        } else if (
                            a.location.toLowerCase() < b.location.toLowerCase()
                        ) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                } else if (this.sortOption === "price") {
                    return lessons.sort(function (a, b) {
                        if (a.price > b.price) {
                            return -1;
                        } else if (a.price < b.price) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                } else if (this.sortOption === "availability") {
                    return lessons.sort(function (a, b) {
                        if (a.spaces > b.spaces) {
                            return -1;
                        } else if (a.spaces < b.spaces) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                }
            }
        },
    },
    async created() {
        // get all lessons from REST API
        const response = await fetch("https://sayma-coursework-2.herokuapp.com/lesson");

        // add lessons result to lessons data property
        this.lessons = await response.json();
    },
    watch: {
        search: {
            async handler(val) {
                const response = await fetch(
                    `https://sayma-coursework-2.herokuapp.com/lesson?search=${val}`
                );

                this.lessons = await response.json();
            },
        },
    },
};
</script>
