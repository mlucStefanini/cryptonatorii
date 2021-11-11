var equalObj = function (o1, o2, debug = false) {
    debug && console.log("check if both are false")
    if (!o1 && !o2) return true;
    debug && console.log("check if one is false and the other one not")
    if (!o1 && o2 || o1 && !o2) return false;
    debug && console.log("check if value is equal")
    if (o1 == o2) return true;
    debug && console.log("check if both are plain objects")
    if (o1.constructor == Object && o2.constructor == Object) {
        for (var prop in o1) {
            debug && console.log(`check if property ${prop} is in both`)
            if (!o2.hasOwnProperty(prop))
                return false;
            debug && console.log("check if both objects have same value for the property")
            if (!equalObj(o1[prop], o2[prop]))
                return false;
        }
        debug && console.log(`check also that all properties from second object are in first`)
        for (var prop in o2) {
            if (!o1.hasOwnProperty(prop))
                return false;
        }
        debug && console.log("objects are equal as their properties are equal")
        return true;
    }
    debug && console.log("objects are not both plain objects")
    return false;
}

class RunContext {
    constructor(api, debug, iteration) {
        this.api = api;
        this.debug = debug;
        this.iteration = iteration;
    }
}

export { equalObj, RunContext }