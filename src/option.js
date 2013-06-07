/**
   # Option

       Option a = Some a + None

   The option type encodes the presence and absence of a value. The
   `some` constructor represents a value and `none` represents the
   absence.

   * fold(a, b) - applies `a` to value if `some` or defaults to `b`
   * getOrElse(a) - default value for `none`
   * isSome - `true` iff `this` is `some`
   * isNone - `true` iff `this` is `none`
   * toLeft(r) - `left(x)` if `some(x)`, `right(r)` if none
   * toRight(l) - `right(x)` if `some(x)`, `left(l)` if none
   * flatMap(f) - monadic flatMap/bind
   * map(f) - functor map
   * ap(s) - applicative ap(ply)
   * append(s, plus) - semigroup append
**/

var Option = taggedSum({
    some: ['x'],
    none: []
});

Option.prototype.fold = function(f, g) {
    return this.cata({
        some: f,
        none: g
    });
};
Option.prototype.getOrElse = function(x) {
    return this.fold(
        identity,
        function() {
            return x;
        }
    );
};
Option.prototype.toLeft = function(o) {
    return this.fold(
        function(x) {
            return Either.left(x);
        },
        function() {
            return Either.right(o);
        }
    );
};
Option.prototype.toRight = function(o) {
    return this.fold(
        function(x) {
            return Either.right(x);
        },
        function() {
            return Either.left(o);
        }
    );
};
Option.prototype.flatMap = function(f) {
    return this.fold(
        function(x) {
            return f(x);
        },
        function() {
            return this;
        }
    );
};
Option.prototype.map = function(f) {
    return this.fold(
        function(x) {
            return Option.some(f(x));
        },
        function() {
            return this;
        }
    );
};
Option.prototype.ap = function(s) {
    return this.fold(
        function(x) {
            return s.map(x);
        },
        function() {
            return this;
        }
    );
};
Option.prototype.append = function(s, plus) {
    return this.fold(
        function(x) {
            return s.map(function(y) {
                return plus(x, y);
            });
        },
        function() {
            return this;
        }
    );
};

/**
   ## some(x)

   Constructor to represent the existance of a value, `x`.
**/
Option.some.prototype.isSome = true;
Option.some.prototype.isNone = false;

/**
   ## none

   Represents the absence of a value.
**/
Option.none.isSome = false;
Option.none.isNone = true;

/**
   ## isOption(a)

   Returns `true` iff `a` is a `some` or `none`.
**/
var isOption = isInstanceOf(Option);

bilby = bilby
    .property('some', Option.some)
    .property('none', Option.none)
    .property('isOption', isOption)
    .method('fold', isOption, function(a, b, c) {
        return a.fold(b, c);
    })
    .method('flatMap', isOption, function(a, b) {
        return a.flatMap(b);
    })
    .method('map', isOption, function(a, b) {
        return a.map(b);
    })
    .method('ap', isOption, function(a, b) {
        return a.ap(b);
    })
    .method('append', isOption, function(a, b) {
        return a.append(b, this.append);
    });
