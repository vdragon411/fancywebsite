let signal = ( _ => {
    let data = {};

    return {
        get: data,
        subscribe: (path, func) => {
            if (!(path in data)) {
                data[path] = {};
            }

            let index,
                keys = Object.keys(data[path]),
                unsubscribed = false;
            
            if (keys.length > 0) {
                index = parseInt(keys[keys.length-1]) + 1;
            }

            data[path][index] = func;

            return {
                unsubscribe: () => {
                    if (!unsubscribed) {
                        delete data[path][index];
                        unsubscribed = true;
                    }
                }
            }
        },
        emit: (path) => {
            if (path in data) {
                for (let f in data[path]) {
                    data[path][f]();
                }
            }
        }
    }
})();

export default signal;