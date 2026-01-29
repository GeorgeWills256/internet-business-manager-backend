"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEVICE_MULTIPLIERS = exports.TIME_PACKAGES = void 0;
exports.TIME_PACKAGES = {
    TWO_HOURS: {
        key: '2H',
        daysEquivalent: 2 / 24,
        multiplier: 0.5,
    },
    FOUR_HOURS: {
        key: '4H',
        daysEquivalent: 4 / 24,
        multiplier: 0.7,
    },
    ONE_DAY: {
        key: '1D',
        daysEquivalent: 1,
        multiplier: 1.0,
    },
    SEVEN_DAYS: {
        key: '7D',
        daysEquivalent: 7,
        multiplier: 5.0,
    },
    THIRTY_DAYS: {
        key: '30D',
        daysEquivalent: 30,
        multiplier: 18.0,
    },
};
exports.DEVICE_MULTIPLIERS = {
    1: 1.0,
    2: 1.5,
    3: 1.8,
    4: 2.0,
};
//# sourceMappingURL=pricing.config.js.map