class Bit {
    static set(array, bit) {
        return array | (1 << bit);
    }

    static clear(array, bit) {
        return array & ~(1 << bit);
    }

    static flip(array, bit) {
        return array ^ (1 << bit);
    }

    static get(array, bit) {
        return (array >> bit) & 1;
    }
}