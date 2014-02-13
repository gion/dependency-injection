(function(global){

    var di, DragonInjector = di = {

        _dependencies: {},

        _toRegister: {},

        process: function(target) {
            var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
                FN_ARG_SPLIT = /,/,
                FN_ARG = /^\s*(_?)(\S+?)\1\s*$/,
                STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
                text = target.toString(),
                args = text.match(FN_ARGS)[1].split(/\s*,\s*/);

            return target.apply(target, this.getDependencies(args));
        },

        getDependencies: function(arr) {
            var self = this;
            var dep = arr.map(function(value) {
                // if the dependency has been queued for registration, but hasn't been registered yet,
                // force the registration process
                if(!self._dependencies.hasOwnProperty(value) && self._toRegister.hasOwnProperty(value)) {
                    self._register(value, self._toRegister[value]);
                }

                return self._dependencies[value];
            });
            return dep;
        },

        _register: function(name, dependency) {
            this._dependencies[name] = this.util.isFn(dependency) ? di.process(dependency) : dependency;
        },

        register: function(name, dependency) {
            this._toRegister[name] = dependency;
        },

        util: {
            isFn: function(fn) {
                return typeof fn == 'function';
            }
        }

    };



    di.register('dog', function dog() {
        return "I'm a dog";
    });


    di.register('cat', function cat() {
        return "I'm a cat";
    });

    di.register('smartypants', function smartypants(a,b,c,d,e,f,dog, cat) {
        console.log(arguments);
        return 'the dog says "' + dog + '", while the cat says "'+ cat +'"';
    });

    di.register('$window', global);

    function dragonjQuery() {
        return function() {document.querySelectorAll.apply(document, arguments)};
    }

    di.register('$', dragonjQuery);
    di.register('jQuery', dragonjQuery);

    di.register('$config', function() {
        return {
           strictType: false
        }
    });

    di.process(function(dog, smartypants, cat) {
        var msg = 'The smartypants guy sais:' +
                '"'+ smartypants +'"';

        console.log(msg);
    });

    var app = di.process(function(jQuery) {
        console.log(jQuery);
        console.log('all p\s:', jQuery('p'));
    });

    // give back Ceaser what's Ceaser's
    global.di = di;
})(this);
