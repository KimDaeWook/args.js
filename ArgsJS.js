(function () {

    var argsJsPrefix = "_ArgsJS_";
    var argsJsCustomFilter = argsJsPrefix + "CustomFilter";    
    var argsJsCaseProperty = argsJsPrefix + "Case";
    var argsJsFilter = function (args, filter) {
        for (var i = 0; i < args.length; i++) this[i] = args[i];
        this[argsJsCustomFilter] = filter;
    }

    var argsJs = {};

    argsJs.String = function (v) { return typeof v == "string"; }
    argsJs.Number = function (v) { return typeof v == "number"; }
    argsJs.Object = function (v) { return typeof v == "object"; }
    argsJs.Function = function (v) { return typeof v == "function"; }
    argsJs.Boolean = function (v) { return typeof v == "boolean"; }
    argsJs.Null = function (v) { return (!v) == true; }
    argsJs.NotNull = function (v) { return (!v) == false; }



    argsJs.And = function () {
        return new argsJsFilter(arguments, function (v) {
            for (var i = 0; i < this.length; i++) {
                if (executeValidators(this[i], v) == false) return false;
            }
            return true;
        });
    }


    argsJs.Or = function () {
        return new argsJsFilter(arguments, function (v) {
            for (var i = 0; i < this.length; i++) {
                if (executeValidators(this[i], v)) return true;
            }
            return false;
        });
    }

    argsJs.Xor = function () {
        return new argsJsFilter(arguments, function (v) {
            var result = null;
            for (var i = 0; i < this.length; i++) {
                var current = executeValidators(this[i], v);
                if (result == null) result = current;
                else result = result ^ current;
            }
            return result;
        });
    }

    var isStrictMode = function() {
        return (eval("var __strictMode__ = null"), (typeof __strictMode__ === "undefined"));
    }

    var ensureArguments = function(args) {
        if (!args) {

            if (isStrictMode()) {
                throw "you must passed with the arguments in strict mode.";
            } else {
                var caller = arguments.callee.caller;
                do {
                    if (!caller) {
                        throw "";
                    } else if (caller.hasOwnProperty("isArgsJS") == false) {
                        return caller.arguments;
                    }
                    caller = caller.caller;
                } while (true)
            }
        }
        return args;
    }

    argsJs.Redirect = function (target, cases, args) {

        args = ensureArguments(args);
        var result = argsJs.Build(cases, args);
        args.case = result[argsJsCaseProperty];

        if (!target) target = window;
        if (target[args.case]) {
            var targetFunction = target[args.case];
            if (targetFunction) {
                return targetFunction.apply(target, args);
            }
        }
        else if (typeof args.case == "function") {
            return args.case.apply(target, args);
        }

        return args.case + ".apply(this, arguments);";
    }
    argsJs.Redirect.isArgsJS = true;

    argsJs.Map = function (cases, args) {

        var strictMode = isStrictMode();
        args = ensureArguments(args);

        var result = argsJs.Build(cases, args);        
        args.case = result.case;

        var mapResult = "";
        for (var key in result) {
            
            var current = result[key];
            if (current && typeof current == "object") {
                mapResult += (strictMode ? "" : "var ") + key + " = arguments[" + current.argumentIndex + "];\n";
            }            

        }
        return mapResult;
    }
    argsJs.Map.isArgsJS = true;

    argsJs.Build = function (cases, args) {
     
        args = ensureArguments(args);
        

        var caseKeys = Object.keys(cases);
        var i;

        for (i = 0; i < caseKeys.length; i++) {

            var currentCase = cases[caseKeys[i]];
            var properties = Object.keys(currentCase);

            var isValidArguments = true;
            for (var propertyIndex = 0; propertyIndex < properties.length; propertyIndex++) {

                var propertyName = properties[propertyIndex];
                if (executeValidators(currentCase[propertyName], args[propertyIndex]) == false) {
                    isValidArguments = false;
                    break;
                }
            }

            if (isValidArguments) {
                var result = {};                
                result[argsJsCaseProperty] = caseKeys[i];
                for (var v = 0; v < properties.length; v++) {
                    var current = {};
                    current.argumentIndex = v;
                    current.value = args[v];
                    result[properties[v]] = current;
                    
                }
                return result;
            }
        }

        return "";

    }
    argsJs.Build.isArgsJS = true;

    var executeValidators = function (validators, argument) {

        if (validators == null) return false;

        if (validators.hasOwnProperty(argsJsCustomFilter)) {
            return validators[argsJsCustomFilter](argument);
        }

        if (typeof validators == "boolean") {
            return validators;
        }
        else if (typeof validators == "function") {
            return validators(argument);
        }
        else if (typeof validators == "object" && validators.length > 0) {
            for (var i = 0; i < validators.length; i++) {
                if (executeValidators(validators[i], argument)) return true;
            }
            return false;
        }

        return false;
    }


    window.ArgsJS = argsJs;
    window.ArgsJSFilter = argsJsFilter;

})();