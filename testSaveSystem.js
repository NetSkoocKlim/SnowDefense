class DataStorage {
    #isTrust;
    #orig;
    constructor() {
        this.#orig = window.localStorage.setItem;
        this.#isTrust = false;
    }

    init() {
        window.localStorage.setItem = (key, value) => this.setItem(key, value);
        window.addEventListener('storage', (event) => {
            event.preventDefault();
            this.#isTrust = true;
            window.localStorage.setItem("user", event.oldValue);
            this.#isTrust = false;
        });
    }

    setItem(key, value) {
        if (this.#isTrust) {
            this.#orig.apply(localStorage, [key, value]);
        }
        else {
            console.log("Method not allowed");
        }
    };
}

let st = new DataStorage();
st.init();