"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.convertAmountToMilliUnits = convertAmountToMilliUnits;
exports.convertMilliUnitsToAmount = convertMilliUnitsToAmount;
exports.formatCurrency = formatCurrency;
exports.calculatePercentageChange = calculatePercentageChange;
exports.fillMissingDays = fillMissingDays;
var clsx_1 = require("clsx");
var date_fns_1 = require("date-fns");
var tailwind_merge_1 = require("tailwind-merge");
function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
function convertAmountToMilliUnits(amount) {
    return Math.round(amount * 1000);
}
function convertMilliUnitsToAmount(milliUnits) {
    return milliUnits / 1000;
}
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}
function calculatePercentageChange(current, previous) {
    if (previous === 0) {
        return previous === current ? 0 : 100;
    }
    return ((current - previous) / previous) * 100;
}
function fillMissingDays(activeDays, startDate, endDate) {
    if (activeDays.length === 0) {
        return [];
    }
    var allDays = (0, date_fns_1.eachDayOfInterval)({ start: startDate, end: endDate });
    var tranactionsByDay = allDays.map(function (date) {
        var found = activeDays.find(function (d) { return d.date === date; });
        if (found) {
            return found;
        }
        else {
            return { date: date, income: 0, expenses: 0 };
        }
    });
    return tranactionsByDay;
}
