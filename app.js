const app = new Vue({
  el: "#app",
  data: {
    
    
    
    name: "",
    phone: "",
    nameError: "",
    phoneError: "",
    
  },
  methods: {
    

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
        await fetch("https://sayma-cw2.onrender.com/order", {
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
          "https://sayma-cw2.onrender.com/lesson/" + item._id,
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

      this.name = "";
      this.phone = "";
      this.nameError = "";
      this.phoneError = "";

      this.showCart = false;
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
    search: {
      async handler(val) {
        const response = await fetch(
          `https://sayma-cw2.onrender.com/lesson?search=${val}`
        );

        this.lessons = await response.json();
      },
    },
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
});
