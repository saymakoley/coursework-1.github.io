const app = new Vue({
  el: "#app",
  data: {
    search: "",
    sortOption: "subject",
    orderOption: "ascending",
    cart: [],
    showCart: false,
    name: "",
    phone: "",
    nameError: "",
    phoneError: "",
    lessons: [],
  },
  methods: {
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
          if (lessonItem.spaces > 0 && lessonItem._id === lesson._id) {
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
        await fetch("https://sayma-coursework-2-env.eba-mykuuqsz.eu-west-2.elasticbeanstalk.com/order", {
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
          "https://sayma-coursework-2-env.eba-mykuuqsz.eu-west-2.elasticbeanstalk.com/lesson/" + item._id,
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
  async created() {
    const response = await fetch(
      "https://sayma-coursework-2-env.eba-mykuuqsz.eu-west-2.elasticbeanstalk.com/lesson"
    );

    this.lessons = await response.json();
  },
  computed: {
    noOfItemsInCart() {
      if (this.cart.length > 0) {
        return this.cart.reduce((total, item) => total + item.spaces, 0);
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
            } else if (a.subject.toLowerCase() < b.subject.toLowerCase()) {
              return -1;
            } else {
              return 0;
            }
          });
        } else if (this.sortOption === "location") {
          return lessons.sort(function (a, b) {
            if (a.location.toLowerCase() > b.location.toLowerCase()) {
              return 1;
            } else if (a.location.toLowerCase() < b.location.toLowerCase()) {
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
            } else if (a.subject.toLowerCase() < b.subject.toLowerCase()) {
              return 1;
            } else {
              return 0;
            }
          });
        } else if (this.sortOption === "location") {
          return lessons.sort(function (a, b) {
            if (a.location.toLowerCase() > b.location.toLowerCase()) {
              return -1;
            } else if (a.location.toLowerCase() < b.location.toLowerCase()) {
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
          `https://sayma-coursework-2-env.eba-mykuuqsz.eu-west-2.elasticbeanstalk.com/lesson?search=${val}`
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
