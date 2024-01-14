/**
 * @typedef {Object} Node - Queue item 
 * @property {returnsPromise} start - Function that returns a promise
 * @property {Node} next - Next item in the queue
 */

/**
* Function that returns a promise
* @callback returnsPromise
* @returns {Promise<*>}
*/

/**
 * Allows simultaneous processing of set number of functions out of a queue
 * @class
 * @public
 */
export default class AsyncQueue {
    /**
     * Maximum allowed number of functions being run simultaneously
     * @type {number}
     */
    allowedSize;

    /**
     * Number of items currently being processed
     * @private
     * @type {number}
     */
    size = 0;

    /**
     * Length of items waiting in the queue
     * @private
     * @type {number}
     */
    length = 0;

    /**
     * Head of the queue
     * @private
     * @type {Node}
     */
    head;

    /**
     * Tail of the queue
     * @private
     * @type {Node}
     */
    tail;

    /**
    * Constructs a Queue
    * @param {number} size - Maximum allowed size
    */
    constructor(size) {
        this.allowedSize = size;
    }


    /**
    * Enqueues a function that returns a promise
    * @param {returnsPromise} func - Function that returns a promise
    */
    enqueue(func) {
        return new Promise((resolve, reject) => {
            if (this.size < this.allowedSize) {
                this.size++;
                func()
                    .then(val => resolve(val))
                    .catch(err => reject(err))
                    .finally(() => this.done());
                return;
            }

            this.length++;
            const node = {
                start: func,
                resolve,
                reject,
            }

            if (!this.head) {
                this.head = node;
                this.tail = node;
                return;
            }

            this.tail.next = node;
            this.tail = node;
        })
    }

    /**
    * Runs when an item is done processing
    * @private
    */
    done() {
        this.size--;

        if (this.size < this.allowedSize && this.length > 0) {
            this.size++;
            this.length--;

            const head = this.head;
            this.head = this.head?.next;
            head.next = undefined;

            head.start()
                .then(val => head.resolve(val))
                .catch(err => head.reject(err))
                .finally(() => this.done());
        }
    }
}
