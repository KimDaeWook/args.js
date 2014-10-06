Args.js
=======


The Args.js the Javascript argument mapping library. 
basically, javascript can't support function overload. So unknown name parameter developers are using. 
but, If the parameter name is not correct, it is difficult to understand the code. like the code below.


### Unknown name parameter example

```javascript
function CreateRect(a, b, c, d) {

    if (typeof a == "object") {
        return new Rect(a.x, a.y, a.w, a.h);
    }
    else if (typeof a == "string") {
        if (typeof b == "string" && typeof c == "string" && typeof d == "string") {
            CreateRect(parseInt(a), parseInt(b), parseInt(c), parseInt(d));
        } else {
            CreateRect.apply(this, a.split(","));
        }                
    }
    else if (typeof a == "number") {

        if (typeof b == "undefined") {
            return new Rect(0, 0, wh, wh);
        }
        else if (typeof b == "number") {
                
            if (typeof c == "undefined") {
                return new Rect(0, 0, a, b);
            }
            else if (typeof c == "number" && typeof d == "number") {
                return new Rect(a, b, c, d);
            }
        }
    }
    return null;
}
```

Args.JS is can map arguments using simple syntax. 
developer just assign parameters cases with parameter predictors. can be used named parameters.

### Using Args.JS example

```javascript
function CreateRectWithArgsJS(a, b, c, d) {
            
    eval(ArgsJS.Map({
        bounds: { x: ArgsJS.Number, y: ArgsJS.Number, w: ArgsJS.Number, h: ArgsJS.Number },
        strBounds: { x: ArgsJS.String, y: ArgsJS.String, w: ArgsJS.String, h: ArgsJS.String },
        size: { w: ArgsJS.Number, h: ArgsJS.Number },
        uniform: { wh: ArgsJS.Number },
        object: { rect: ArgsJS.Object },
        parse : { strRect : ArgsJS.String }
    }));
           
    switch (arguments.case) {
        case "bounds" :
            return new Rect(x, y, w, h);
        case "strBounds":
            return new Rect(parseInt(x), parseInt(y), parseInt(w), parseInt(h));
        case "size" :
            return new Rect(0, 0, w, h);
        case "uniform":
            return new Rect(0, 0, wh, wh);
        case "object":
            return new Rect(rect.x, rect.y, rect.w, rect.h);
        case "parse":
            return CreateRectWithArgsJS.apply(this, strRect.split(","));
    }

    return null;
}
```
=======
#References

##ArgsJS.Map
`ArgsJS.Map` method provide to named parameters from unknown name parameter.
`ArgsJS.Map` is always used with the eval function. because, return value of ArgsJS.Map is the source code for arguments mapping. so, using `eval` function for evaluate to `ArgsJS.Map` result.

####ArgsJS.Map return value

```javascript
CreateRectWithArgsJS(10, 10, 100, 100);

var mapResult = ArgsJS.Map({
    bounds: { x: ArgsJS.Number, y: ArgsJS.Number, w: ArgsJS.Number, h: ArgsJS.Number },
});

// console.log(x) => undefined
// console.log(y) => undefined

/*  console.log(mapResult)
    ============================================
    var x = arguments[0];
    var y = arguments[1];
    var w = arguments[2];
    var h = arguments[3];
    ============================================
*/
eval(mapResult);

// console.log(x) => 10
// console.log(y) => 10
```


##ArgsJS.Redirect
`ArgsJS.Redirect` can redirect a function depending on the condition of the mapped.

```javascript
function CreateRectWithRedirect(a, b, c, d) {
    return ArgsJS.Redirect(this, {
        bounds: { x: ArgsJS.Number, y: ArgsJS.Number, w: ArgsJS.Number, h: ArgsJS.Number },
        size: { w: ArgsJS.Number, h: ArgsJS.Number },
    });
}

function bounds(x, y, w, h) {
    return new Rect(x, y, w, h);
}

function size(w, h) {
    return new Rect(0, 0, w, h);
}
```

##ArgsJS.Build
`ArgsJS.Build` is base function for arguments mapping. `ArgsJS.Build` is provide argument mapping object.
```javascript
function CreateRectWithBuild(a, b, c, d) {
    var buildResult = ArgsJS.Build({
        bounds: { x: ArgsJS.Number, y: ArgsJS.Number, w: ArgsJS.Number, h: ArgsJS.Number },
        size: { w: ArgsJS.Number, h: ArgsJS.Number },
    });

    var json = JSON.stringify(buildResult);
    console.log(json);
}
```
####ArgsJS.Build Result
```javascript
{
    "_ArgsJS_Case":"bounds",
    "x":{ "argumentIndex":0, "value":10 },
    "y":{ "argumentIndex":1, "value":10 },
    "w":{ "argumentIndex":2, "value":100 },
    "h":{ "argumentIndex":3, "value":100 }
}
```

