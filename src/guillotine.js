var _ = require('lodash');

var Rectangle = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};

var Slates = function (slates) {
    this.slates = _.cloneDeep(slates);
    this.markUnused();
};

Slates.prototype.generator = function* () {
    var current = this.slates.shift();
    this.slates.push(current);

    while (current) {
        yield current;
        if (!this.hasMore()) {
            break;
        }
        do {
            current = this.slates.shift();
            this.slates.push(current);
        } while (current.marked);
    }
};

Slates.prototype.pop = function () {
    return this.slates.pop();
};

Slates.prototype.push = function (slate) {
    return this.slates.push(slate);
};

Slates.prototype.shift = function () {
    return this.slates.shift();
};

Slates.prototype.unshift = function (slate) {
    return this.slates.unshift(slate);
};

Slates.prototype.markUnused = function () {
    _.each(this.slates, (slate) => {
        delete slate.marked;
    });
    return this.slates;
};

Slates.prototype.hasMore = function () {
    return !_.all(this.slates, 'marked');
};

var Slate = function (rect) {
    this.rect = rect;
};

var Part = function (w, h) {
    this.w = w;
    this.h = h;
};

function apply (slate, parts) {
    var result = [];
    var res = solution([slate], parts.sort((part1, part2) => {
        // TODO: different sorting depending on cut direction
        return part1.w === part2.w ? part2.h - part1.h : part2.w - part1.w;
    }), result);

    return res && result;
}

function solution (s, parts, result) {
    console.log(s, parts, result);
    var slates = new Slates(s);
    var gen = slates.generator();

    while (slates.hasMore()) {
        if (parts.length === 0) {
            return true;
        }

        var slate = gen.next();
        if (slate.done) {
            return false;
        } else {
            slate.value.marked = true;
        }

        var part = parts[0];

        console.log('Consider', slate);
        while (!slate.done && !(part.w <= slate.value.rect.w && part.h <= slate.value.rect.h)) {
            slate = gen.next();
            console.log('Consider', slate);
            if (slate.value) {
                slate.value.marked = true;
            }
        }
        if (slate.done) {
            return false;
        }

        slates.pop();
        slate = slate.value;
        result.push(new Rectangle(slate.rect.x, slate.rect.y, part.w, part.h));

        // TODO: use vertical cuts too
        var newWidth = slate.rect.w - part.w;
        var newHeight = slate.rect.h - part.h;
        if (newWidth) {
            slates.unshift(new Slate(new Rectangle(slate.rect.x + part.w, slate.rect.y, newWidth, slate.rect.h)));
        }
        if (newHeight) {
            slates.unshift(new Slate(new Rectangle(slate.rect.x, slate.rect.y + part.h, part.w, newHeight)));
        }

        parts.shift();
        if (solution(slates.slates, parts, result)) {
            return true;
        }

        // Reverse everything
        if (newWidth) {
            slates.shift();
        }
        if (newHeight) {
            slates.shift();
        }
        parts.unshift(part);
        slates.push(slate); // Put slate at end so another one is picked
        result.pop();
    }

    console.log('Backtracking...');

    return false;
}

module.exports = {
    apply: apply,
    Rectangle: Rectangle,
    Slate: Slate,
    Part: Part
};
