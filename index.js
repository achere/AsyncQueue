import AsyncQueue from "./queue.js";

const queue = new AsyncQueue(3);
const wait = [5, 3, 7, 4, 6, 2, 5];

wait.forEach((sec, ind) => {
	const fun = () => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (ind % 2 === 0) {
					resolve(`resolving fun #${ind} after ${sec} sec`);
				} else {
					reject(`rejecting fun #${ind} after ${sec} sec`);
				}
			}, sec * 1000);
		});
	};
	queue.enqueue(fun)
		.then(val => console.log(val))
		.catch(err => console.log(err));
});

