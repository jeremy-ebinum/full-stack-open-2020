"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
    Gender["Other"] = "other";
})(Gender = exports.Gender || (exports.Gender = {}));
var EntryType;
(function (EntryType) {
    EntryType["HealthCheck"] = "HealthCheck";
    EntryType["OccupationalHealthCare"] = "OccupationalHealthcare";
    EntryType["Hospital"] = "Hospital";
})(EntryType = exports.EntryType || (exports.EntryType = {}));
var HealthCheckRating;
(function (HealthCheckRating) {
    HealthCheckRating[HealthCheckRating["Healthy"] = 0] = "Healthy";
    HealthCheckRating[HealthCheckRating["LowRisk"] = 1] = "LowRisk";
    HealthCheckRating[HealthCheckRating["HighRisk"] = 2] = "HighRisk";
    HealthCheckRating[HealthCheckRating["CriticalRisk"] = 3] = "CriticalRisk";
})(HealthCheckRating = exports.HealthCheckRating || (exports.HealthCheckRating = {}));
