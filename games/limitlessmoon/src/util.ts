// LATER move this to alexpear.github.io/util/. Make sure it gets compiled properly by each project that uses it.

export class Util {
    // Note that typeof NaN is also 'number',
    // but it is still despicable.
    static isNumber(x: unknown): boolean {
        return typeof x === 'number' && !Util.isNaN(x);
    }

    static isString(x: unknown): boolean {
        return typeof x === 'string';
    }

    static isNaN(x: unknown): boolean {
        return Number.isNaN(x);
    }

    static isObject(x: unknown): boolean {
        return typeof x === 'object' && x !== null;
    }

    static isFunction(x: unknown): boolean {
        return typeof x === 'function';
    }

    static isPrimitive(x: unknown): boolean {
        if (x === undefined || x === null) {
            return true;
        }

        return ['boolean', 'symbol', 'bigint', 'number', 'string'].includes(
            typeof x,
        );
    }

    static array<T>(x: T | T[]): T[] {
        return Array.isArray(x) ? x : [x];
    }

    // Modifies the array.
    static shuffle<T>(array: T[]): T[] {
        for (let i = 0; i <= array.length - 2; i++) {
            const untouchedCount = array.length - 1 - i;

            const swapWith = i + Math.ceil(Math.random() * untouchedCount);

            const temp = array[i];
            array[i] = array[swapWith];
            array[swapWith] = temp;
        }

        return array;
    }

    static exists(x: unknown): boolean {
        return x !== undefined && x !== null && x !== '' && !Util.isNaN(x);
    }

    static legit(x: unknown): boolean {
        return (
            Util.exists(x) &&
            // it's not []
            !(Array.isArray(x) && x.length === 0) &&
            // it's not {}
            !(typeof x === 'object' && Object.keys(x).length === 0)
        );
    }

    // Default 0
    static sum(array: number[]): number {
        return Util.array(array).reduce((sumSoFar, element) => {
            const n = Number(element) || 0;
            return sumSoFar + n;
        }, 0);
    }

    static randomBelow(maxExclusive: number): number {
        return Math.floor(Math.random() * maxExclusive);
    }

    static uuid(): string {
        return crypto.randomUUID();
    }

    static containsVowels(s: string): boolean {
        const chars = s.toUpperCase().split('');

        for (const char of chars) {
            if ('AEIOUY'.includes(char)) {
                return true;
            }
        }

        return false;
    }

    static isAllCaps(s: string): boolean {
        return s === s.toUpperCase();
    }

    static isCapitalized(s: string): boolean {
        return /[A-Z]/.test(s[0]);
    }

    static capitalized(s: string): string {
        if (!Util.exists(s)) {
            return '';
        } else if (s.length === 1) {
            return s.toUpperCase();
        }
        // Controversially, interpret no-vowel strings as acronyms
        else if (!Util.containsVowels(s)) {
            return s.toUpperCase();
        }

        return s[0].toUpperCase() + s.slice(1);
        // s.slice(1).toLowerCase();
    }

    static toCamelCase(s: string): string {
        if (!Util.exists(s)) {
            return '';
        }

        const words = s.split(/\s/);
        const tail = words
            .slice(1)
            .map((sub) => Util.capitalized(sub))
            .join('');

        return words[0].toLowerCase() + tail;
    }

    // input: 'dolphinWithWings'
    // returns: 'Dolphin With Wings'
    static fromCamelCase(s: string): string {
        if (!Util.exists(s)) {
            return '';
        } else if (s.length === 1) {
            return s.toUpperCase();
        }

        const wordStarts = [0];
        const words = [];

        for (let i = 1; i < s.length; i++) {
            // Util.logDebug(`fromCamelCase(), s is ${s}, i is ${i}, s[i] is ${s[i]}`)

            if (Util.isCapitalized(s[i])) {
                if (Util.isCapitalized(s[i - 1])) {
                    // Detect acronym words and leave them uppercase.
                    // eg: openHTMLFile
                    const followedByLowercase =
                        i < s.length - 1 && !Util.isCapitalized(s[i + 1]);
                    if (!followedByLowercase) {
                        continue;
                    }
                }

                wordStarts.push(i);

                const firstLetter = wordStarts[wordStarts.length - 2];
                const word = s.slice(firstLetter, i);
                words.push(word);
            }

            // Also want to consider a digit after a nondigit, or vice versa, to be a word start.
            else if (Util.alphanumericTransition(s, i)) {
                wordStarts.push(i);

                const firstLetter = wordStarts[wordStarts.length - 2];
                const word = s.slice(firstLetter, i);
                words.push(word);
            }
        }

        const lastCapital = wordStarts[wordStarts.length - 1];
        const lastWord = s.slice(lastCapital);
        words.push(lastWord);

        return words
            .map(
                // Do not change acronyms
                (w) => (Util.isAllCaps(w) ? w : Util.capitalized(w)),
            )
            .join(' ');
    }

    // True when string[i2-1] and string[i2] are a digit and a letter, in either order.
    static alphanumericTransition(string: string, i2: number): boolean {
        const digitStart = Util.isNumericString(string[i2 - 1]);

        const digitEnd = Util.isNumericString(string[i2]);

        return (digitStart && !digitEnd) || (!digitStart && digitEnd);
    }

    static testCamelCase(): void {
        const tests = [
            ['Hector Breaker Of Horses', 'hectorBreakerOfHorses'],
            ['Cellar Door', 'cellarDoor'],
            ['C Deck', 'cDeck'],
            ['Awakening', 'awakening'],
            ['No URL Found', 'noURLFound'],
        ];

        tests.forEach((t) => {
            const camelized = Util.toCamelCase(t[0]);
            const uncamelized = Util.fromCamelCase(t[1]);

            if (camelized !== t[1]) {
                throw new Error(camelized);
            }
            if (uncamelized !== t[0]) {
                throw new Error(uncamelized);
            }
        });
    }

    static randomOf<T>(array: T[]): T {
        return array[Util.randomBelow(array.length)];
    }

    static randomIntBetween(
        minInclusive: number,
        maxExclusive: number,
    ): number {
        if (!Util.exists(minInclusive) || !Util.exists(maxExclusive)) {
            console.log(
                'error: Util.randomIntBetween() called with missing parameters.',
            );
            throw new Error(`max ${maxExclusive}, min ${minInclusive}`);
        } else if (maxExclusive < minInclusive) {
            console.log(
                'error: Util.randomIntBetween() called with max < min.',
            );
            throw new Error(`max ${maxExclusive}, min ${minInclusive}`);
        } else if (maxExclusive === minInclusive) {
            return minInclusive;
        }

        return Math.floor(
            Math.random() * (maxExclusive - minInclusive) + minInclusive,
        );
    }

    // Returns a deep copy of the object, with chaff removed.
    static tidy(obj: object, ...badProps: string[]): object {
        if (Array.isArray(obj)) {
            return obj.map((element) => Util.tidy(element, ...badProps));
        } else if (obj && typeof obj === 'object') {
            return Object.fromEntries(
                Object.entries(obj)
                    .filter(
                        ([key]) =>
                            !badProps.includes(key) && Util.legit(obj[key]),
                    )
                    .map(([key, value]) => [
                        key,
                        Util.tidy(value, ...badProps),
                    ]),
            );
        }

        return obj;
    }
}
