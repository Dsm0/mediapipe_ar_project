(function () {
    /*
    Copyright The Closure Library Authors.
    SPDX-License-Identifier: Apache-2.0
    */
    'use strict';

    // Utility function to iterate over an array
    function createIterator(array) {
        let index = 0;
        return function () {
            return index < array.length ? { done: false, value: array[index++] } : { done: true };
        };
    }

    // Polyfill for Object.defineProperty
    const defineProperty = typeof Object.defineProperties === "function" ? Object.defineProperty : function (obj, prop, descriptor) {
        if (obj === Array.prototype || obj === Object.prototype) return obj;
        obj[prop] = descriptor.value;
        return obj;
    };

    // Function to find the global object
    function getGlobalObject(context) {
        const possibleGlobals = [
            typeof globalThis === "object" && globalThis,
            context,
            typeof window === "object" && window,
            typeof self === "object" && self,
            typeof global === "object" && global
        ];

        for (let i = 0; i < possibleGlobals.length; ++i) {
            const global = possibleGlobals[i];
            if (global && global.Math === Math) return global;
        }
        throw new Error("Cannot find global object");
    }

    const globalObject = getGlobalObject(this);

    // Function to define or redefine a property on the global object
    function defineOrRedefineProperty(path, redefineFn) {
        if (redefineFn) {
            const parts = path.split(".");
            let current = globalObject;

            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!(part in current)) break;
                current = current[part];
            }

            const lastPart = parts[parts.length - 1];
            const currentValue = current[lastPart];
            const newValue = redefineFn(currentValue);

            if (newValue !== currentValue && newValue !== null) {
                defineProperty(current, lastPart, { configurable: true, writable: true, value: newValue });
            }
        }
    }

    // Polyfill for Symbol
    defineOrRedefineProperty("Symbol", function (existingSymbol) {
        if (existingSymbol) return existingSymbol;

        let symbolCounter = 0;
        const symbolPrefix = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_";

        function Symbol(description) {
            if (this instanceof Symbol) throw new TypeError("Symbol is not a constructor");
            return new SymbolInstance(symbolPrefix + (description || "") + "_" + symbolCounter++, description);
        }

        function SymbolInstance(id, description) {
            this.id = id;
            defineProperty(this, "description", { configurable: true, writable: true, value: description });
        }

        SymbolInstance.prototype.toString = function () {
            return this.id;
        };

        return Symbol;
    });

    // Polyfill for Symbol.iterator
    defineOrRedefineProperty("Symbol.iterator", function (existingIterator) {
        if (existingIterator) return existingIterator;

        const iteratorSymbol = Symbol("Symbol.iterator");
        const iterableTypes = [
            "Array", "Int8Array", "Uint8Array", "Uint8ClampedArray",
            "Int16Array", "Uint16Array", "Int32Array", "Uint32Array",
            "Float32Array", "Float64Array"
        ];

        for (let i = 0; i < iterableTypes.length; i++) {
            const type = globalObject[iterableTypes[i]];
            if (typeof type === "function" && typeof type.prototype[iteratorSymbol] !== "function") {
                defineProperty(type.prototype, iteratorSymbol, {
                    configurable: true,
                    writable: true,
                    value: function () {
                        return createIterable(createIterator(this));
                    }
                });
            }
        }

        return iteratorSymbol;
    });

    // Helper function to create an iterable object
    function createIterable(iterator) {
        const iterable = { next: iterator };
        iterable[Symbol.iterator] = function () { return this; };
        return iterable;
    }

    // Function to get an iterator for an object
    function getIterator(obj) {
        const iteratorMethod = typeof Symbol !== "undefined" && Symbol.iterator && obj[Symbol.iterator];
        return iteratorMethod ? iteratorMethod.call(obj) : { next: createIterator(obj) };
    }

    // Generator state management
    function GeneratorState() {
        this.isRunning = false;
        this.currentValue = null;
        this.returnValue = undefined;
        this.state = 1;
        this.finallyState = 0;
        this.exception = null;
    }

    function checkGeneratorRunning(generator) {
        if (generator.isRunning) throw new TypeError("Generator is already running");
        generator.isRunning = true;
    }

    GeneratorState.prototype.setReturnValue = function (value) {
        this.returnValue = value;
    };

    function handleException(generator, exception) {
        generator.exception = { value: exception, isException: true };
        generator.state = generator.finallyState;
    }

    GeneratorState.prototype.return = function (value) {
        this.exception = { return: value };
        this.state = this.finallyState;
    };

    function Generator(generatorFunction) {
        this.state = new GeneratorState();
        this.generatorFunction = generatorFunction;
    }

    function handleReturn(generator, value) {
        checkGeneratorRunning(generator.state);
        const iterator = generator.state.currentValue;
        if (iterator) {
            return handleIteratorMethod(generator, "return" in iterator ? iterator["return"] : function (v) { return { value: v, done: true }; }, value, generator.state.return);
        }
        generator.state.return(value);
        return executeGenerator(generator);
    }

    function handleIteratorMethod(generator, method, value, returnValueHandler) {
        try {
            const result = method.call(generator.state.currentValue, value);
            if (!(result instanceof Object)) throw new TypeError("Iterator result " + result + " is not an object");
            if (!result.done) return generator.state.isRunning = false, result;
            const finalValue = result.value;
        } catch (error) {
            generator.state.currentValue = null;
            handleException(generator.state, error);
            return executeGenerator(generator);
        }
        generator.state.currentValue = null;
        returnValueHandler.call(generator.state, finalValue);
        return executeGenerator(generator);
    }

    function executeGenerator(generator) {
        while (generator.state.state) {
            try {
                const result = generator.generatorFunction(generator.state);
                if (result) return generator.state.isRunning = false, { value: result.value, done: false };
            } catch (error) {
                generator.state.returnValue = undefined;
                handleException(generator.state, error);
            }
        }
        generator.state.isRunning = false;
        if (generator.state.exception) {
            const exception = generator.state.exception;
            generator.state.exception = null;
            if (exception.isException) throw exception.value;
            return { value: exception.return, done: true };
        }
        return { value: undefined, done: true };
    }

    function GeneratorIterator(generator) {
        this.next = function (value) {
            checkGeneratorRunning(generator.state);
            if (generator.state.currentValue) {
                return handleIteratorMethod(generator, generator.state.currentValue.next, value, generator.state.setReturnValue);
            }
            generator.state.setReturnValue(value);
            return executeGenerator(generator);
        };
        this.throw = function (value) {
            checkGeneratorRunning(generator.state);
            if (generator.state.currentValue) {
                return handleIteratorMethod(generator, generator.state.currentValue["throw"], value, generator.state.setReturnValue);
            }
            handleException(generator.state, value);
            return executeGenerator(generator);
        };
        this.return = function (value) {
            return handleReturn(generator, value);
        };
        this[Symbol.iterator] = function () {
            return this;
        };
    }

    function asyncGenerator(generator) {
        function handleNext(value) {
            return generator.next(value);
        }
        function handleThrow(value) {
            return generator.throw(value);
        }
        return new Promise(function (resolve, reject) {
            function handleResult(result) {
                result.done ? resolve(result.value) : Promise.resolve(result.value).then(handleNext, handleThrow).then(handleResult, reject);
            }
            handleResult(generator.next());
        });
    }

    // Polyfill for Promise
    defineOrRedefineProperty("Promise", function (existingPromise) {
        if (existingPromise) return existingPromise;

        function Promise(executor) {
            this.state = 0;
            this.value = undefined;
            this.callbacks = [];
            this.isHandled = false;
            const resolveReject = this.createResolveReject();
            try {
                executor(resolveReject.resolve, resolveReject.reject);
            } catch (error) {
                resolveReject.reject(error);
            }
        }

        function CallbackQueue() {
            this.callbacks = null;
        }

        CallbackQueue.prototype.addCallback = function (callback) {
            if (this.callbacks === null) {
                this.callbacks = [];
                const self = this;
                this.schedule(function () {
                    self.executeCallbacks();
                });
            }
            this.callbacks.push(callback);
        };

        const setTimeoutFn = globalObject.setTimeout;

        CallbackQueue.prototype.schedule = function (callback) {
            setTimeoutFn(callback, 0);
        };

        CallbackQueue.prototype.executeCallbacks = function () {
            while (this.callbacks && this.callbacks.length) {
                const callbacks = this.callbacks;
                this.callbacks = [];
                for (let i = 0; i < callbacks.length; ++i) {
                    const callback = callbacks[i];
                    callbacks[i] = null;
                    try {
                        callback();
                    } catch (error) {
                        this.handleException(error);
                    }
                }
            }
            this.callbacks = null;
        };

        CallbackQueue.prototype.handleException = function (error) {
            this.schedule(function () {
                throw error;
            });
        };

        Promise.prototype.createResolveReject = function () {
            const self = this;
            let isResolvedOrRejected = false;
            return {
                resolve: function (value) {
                    if (!isResolvedOrRejected) {
                        isResolvedOrRejected = true;
                        self.resolve(value);
                    }
                },
                reject: function (reason) {
                    if (!isResolvedOrRejected) {
                        isResolvedOrRejected = true;
                        self.reject(reason);
                    }
                }
            };
        };

        Promise.prototype.resolve = function (value) {
            if (value === this) {
                this.reject(new TypeError("A Promise cannot resolve to itself"));
            } else if (value instanceof Promise) {
                this.handlePromise(value);
            } else {
                const valueType = typeof value;
                const isObjectOrFunction = valueType === "object" ? value !== null : valueType === "function";
                isObjectOrFunction ? this.handleThenable(value) : this.fulfill(value);
            }
        };

        Promise.prototype.handleThenable = function (thenable) {
            let then;
            try {
                then = thenable.then;
            } catch (error) {
                this.reject(error);
                return;
            }
            if (typeof then === "function") {
                this.handleThen(then, thenable);
            } else {
                this.fulfill(thenable);
            }
        };

        Promise.prototype.reject = function (reason) {
            this.settle(2, reason);
        };

        Promise.prototype.fulfill = function (value) {
            this.settle(1, value);
        };

        Promise.prototype.settle = function (state, value) {
            if (this.state !== 0) throw new Error("Cannot settle(" + state + ", " + value + "): Promise already settled in state" + this.state);
            this.state = state;
            this.value = value;
            if (state === 2) this.handleUnhandledRejection();
            this.executeCallbacks();
        };

        Promise.prototype.handleUnhandledRejection = function () {
            const self = this;
            setTimeoutFn(function () {
                if (self.isUnhandledRejection()) {
                    const console = globalObject.console;
                    if (typeof console !== "undefined") console.error(self.value);
                }
            }, 1);
        };

        Promise.prototype.isUnhandledRejection = function () {
            if (this.isHandled) return false;
            const CustomEvent = globalObject.CustomEvent;
            const Event = globalObject.Event;
            const dispatchEvent = globalObject.dispatchEvent;
            if (typeof dispatchEvent === "undefined") return true;
            let event;
            if (typeof CustomEvent === "function") {
                event = new CustomEvent("unhandledrejection", { cancelable: true });
            } else if (typeof Event === "function") {
                event = new Event("unhandledrejection", { cancelable: true });
            } else {
                event = globalObject.document.createEvent("CustomEvent");
                event.initCustomEvent("unhandledrejection", false, true, event);
            }
            event.promise = this;
            event.reason = this.value;
            return dispatchEvent(event);
        };

        Promise.prototype.executeCallbacks = function () {
            if (this.callbacks !== null) {
                for (let i = 0; i < this.callbacks.length; ++i) {
                    callbackQueue.addCallback(this.callbacks[i]);
                }
                this.callbacks = null;
            }
        };

        const callbackQueue = new CallbackQueue();

        Promise.prototype.handlePromise = function (promise) {
            const resolveReject = this.createResolveReject();
            promise.then(resolveReject.resolve, resolveReject.reject);
        };

        Promise.prototype.handleThen = function (then, thenable) {
            const resolveReject = this.createResolveReject();
            try {
                then.call(thenable, resolveReject.resolve, resolveReject.reject);
            } catch (error) {
                resolveReject.reject(error);
            }
        };

        Promise.prototype.then = function (onFulfilled, onRejected) {
            const self = this;
            function wrapCallback(callback, defaultCallback) {
                return typeof callback === "function" ? function (value) {
                    try {
                        resolve(callback(value));
                    } catch (error) {
                        reject(error);
                    }
                } : defaultCallback;
            }
            let resolve, reject;
            const newPromise = new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            this.handleCallbacks(wrapCallback(onFulfilled, resolve), wrapCallback(onRejected, reject));
            return newPromise;
        };

        Promise.prototype.catch = function (onRejected) {
            return this.then(undefined, onRejected);
        };

        Promise.prototype.handleCallbacks = function (onFulfilled, onRejected) {
            const self = this;
            function handleCallback() {
                switch (self.state) {
                    case 1:
                        onFulfilled(self.value);
                        break;
                    case 2:
                        onRejected(self.value);
                        break;
                    default:
                        throw new Error("Unexpected state: " + self.state);
                }
            }
            if (this.callbacks === null) {
                callbackQueue.addCallback(handleCallback);
            } else {
                this.callbacks.push(handleCallback);
            }
            this.isHandled = true;
        };

        Promise.resolve = function (value) {
            return value instanceof Promise ? value : new Promise(function (resolve) { resolve(value); });
        };

        Promise.reject = function (reason) {
            return new Promise(function (_, reject) { reject(reason); });
        };

        Promise.race = function (iterable) {
            return new Promise(function (resolve, reject) {
                for (const value of getIterator(iterable)) {
                    Promise.resolve(value).then(resolve, reject);
                }
            });
        };

        Promise.all = function (iterable) {
            const iterator = getIterator(iterable);
            const first = iterator.next();
            if (first.done) return Promise.resolve([]);
            return new Promise(function (resolve, reject) {
                const results = [];
                let remaining = 0;
                function handleResult(index) {
                    return function (value) {
                        results[index] = value;
                        remaining--;
                        if (remaining === 0) resolve(results);
                    };
                }
                do {
                    results.push(undefined);
                    remaining++;
                    Promise.resolve(first.value).then(handleResult(results.length - 1), reject);
                    first = iterator.next();
                } while (!first.done);
            });
        };

        return Promise;
    });

    // Polyfill for Object.assign
    const assign = typeof Object.assign === "function" ? Object.assign : function (target, ...sources) {
        for (let i = 1; i < sources.length; i++) {
            const source = sources[i];
            if (source) {
                for (const key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };

    defineOrRedefineProperty("Object.assign", function (existingAssign) {
        return existingAssign || assign;
    });

    const globalContext = this || self;
    const defaultCameraSettings = { facingMode: "user", width: 640, height: 480 };

    function Camera(videoElement, options) {
        this.video = videoElement;
        this.currentTime = 0;
        this.settings = assign(assign({}, defaultCameraSettings), options);
    }

    Camera.prototype.stop = function () {
        const self = this;
        return asyncGenerator(new GeneratorIterator(new Generator(function (generatorState) {
            if (self.stream) {
                const tracks = self.stream.getTracks();
                for (const track of getIterator(tracks)) {
                    track.stop();
                }
                self.stream = undefined;
            }
            generatorState.state = 0;
        })));
    };

    Camera.prototype.start = function () {
        const self = this;
        return asyncGenerator(new GeneratorIterator(new Generator(function (generatorState) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("No navigator.mediaDevices.getUserMedia exists.");
            }
            const settings = self.settings;
            return generatorState.return(navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: settings.facingMode,
                    width: settings.width,
                    height: settings.height
                }
            }).then(function (stream) {
                handleStream(self, stream);
            }).catch(function (error) {
                const errorMessage = "Failed to acquire camera feed: " + error;
                console.error(errorMessage);
                alert(errorMessage);
                throw error;
            }));
        })));
    };

    function requestAnimationFrameLoop(camera) {
        window.requestAnimationFrame(function () {
            updateFrame(camera);
        });
    }

    function handleStream(camera, stream) {
        camera.stream = stream;
        camera.video.srcObject = stream;
        camera.video.onloadedmetadata = function () {
            camera.video.play();
            requestAnimationFrameLoop(camera);
        };
    }

    function updateFrame(camera) {
        let frameCallback = null;
        if (!camera.video.paused && camera.video.currentTime !== camera.currentTime) {
            camera.currentTime = camera.video.currentTime;
            frameCallback = camera.settings.onFrame();
        }
        if (frameCallback) {
            frameCallback.then(function () {
                requestAnimationFrameLoop(camera);
            });
        } else {
            requestAnimationFrameLoop(camera);
        }
    }

    const cameraNamespace = ["Camera"];
    let globalNamespace = globalContext;

    for (let namespacePart; cameraNamespace.length && (namespacePart = cameraNamespace.shift());) {
        if (cameraNamespace.length || typeof Camera === "undefined") {
            if (globalNamespace[namespacePart] && globalNamespace[namespacePart] !== Object.prototype[namespacePart]) {
                globalNamespace = globalNamespace[namespacePart];
            } else {
                globalNamespace = globalNamespace[namespacePart] = {};
            }
        } else {
            globalNamespace[namespacePart] = Camera;
        }
    }
}).call(this);
