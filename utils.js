// shuffles array
const shuffle = (arr) => {
    let counter = arr.length;

    while(counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;
        [arr[counter], arr[index]] = [arr[index], arr[counter]];
    }
    return arr;
};