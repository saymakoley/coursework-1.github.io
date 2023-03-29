<template>
    <section class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-6">
        <div class="space-y-4">
            <h2
                class="uppercase tracking-wider text-xl font-bold text-blue-700"
            >
                Shopping Cart
            </h2>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div
                    class="border border-gray-200 rounded"
                    v-for="cartItem in cart"
                    :key="cartItem.id"
                >
                    <img
                        v-bind:src="`https://sayma-coursework-2.herokuapp.com/images/${cartItem.image}`"
                        class="w-full h-40"
                        v-bind:alt="cartItem.subject"
                    />
                    <div class="p-4">
                        <p>
                            <strong>Subject: </strong>
                            {{ cartItem.subject }}
                        </p>
                        <p>
                            <strong>Location: </strong>
                            {{ cartItem.location }}
                        </p>
                        <p>
                            <strong>Price: </strong>
                            £{{ cartItem.price }}
                        </p>
                        <p>
                            <strong>Spaces: </strong>
                            {{ cartItem.spaces }}
                        </p>

                        <button
                            class="bg-blue-700 p-2 text-white rounded !mt-4 disabled:opacity-20"
                            v-on:click="
                                $emit('removeItemFromCart', cartItem._id)
                            "
                        >
                            Remove from cart
                        </button>
                    </div>
                </div>
            </div>

            <form
                v-on:submit.prevent="checkout"
                class="w-full sm:w-2/3 lg:w-1/4 space-y-4 p-4 border rounded shadow"
            >
                <h3 class="text-xl font-semibold text-blue-700">Checkout</h3>

                <input
                    type="text"
                    class="p-2 border w-full"
                    placeholder="Name"
                    v-model="name"
                />
                <span v-if="nameError" class="text-red-500">{{
                    nameError
                }}</span>

                <br />

                <input
                    type="tel"
                    class="p-2 border w-full"
                    placeholder="Phone"
                    v-model="phone"
                />
                <span v-if="phoneError" class="text-red-500">{{
                    phoneError
                }}</span>

                <br />

                <button
                    class="bg-blue-700 p-2 rounded text-white"
                    :class="{ 'opacity-20': !isCheckoutFormValid }"
                    v-bind:disabled="!isCheckoutFormValid"
                >
                    Checkout
                </button>
            </form>
        </div>
    </section>
</template>

<script>
export default {
    name: "Checkout",

    props: {
        cart: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            name: "",
            phone: "",
            nameError: "",
            phoneError: "",
        };
    },
    methods: {
        checkout() {
            // get and format data
            const form = {
                name: this.name,
                phone: this.phone,
            };

            // emit event
            this.$emit("checkout", form);

            // clear form
            this.name = "";
            this.phone = "";
            this.nameError = "";
            this.phoneError = "";
        },
    },

    computed: {
        isCheckoutFormValid() {
            if (this.name && this.phone) {
                if (!this.nameError && !this.phoneError) {
                    return true;
                }
            }

            return false;
        },
    },
    watch: {
        name: {
            handler(newValue) {
                const regex = /^[A-Za-z\s]*$/;
                if (!newValue) {
                    this.nameError = "Please enter your name";
                } else if (!regex.test(newValue)) {
                    this.nameError = "Please enter a valid name";
                } else {
                    this.nameError = "";
                }
            },
        },

        phone: {
            handler(newValue) {
                const regex = /^\d+$/;

                if (!newValue) {
                    this.phoneError = "Please enter your phone number";
                } else if (!regex.test(newValue)) {
                    this.phoneError = "Please enter a valid number";
                } else {
                    this.phoneError = "";
                }
            },
        },
    },
};
</script>