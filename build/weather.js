"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEATHER_URL = exports.Weather = exports.WeatherResponseSchema = void 0;
var zod_1 = require("zod");
var weatherCodes = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'OverCast',
    45: 'Fog',
    48: 'Depositing Rime-Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    56: 'Light Freezing-Drizzle',
    57: 'Dense Freezing-Drizzle',
    61: 'Light Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    66: 'Light Freezing-Rain',
    67: 'Heavy Freezing-Rain',
    71: 'Slight Snow-Fall',
    73: 'Moderate Snow-Fall',
    75: 'Heavy Snow-Fall',
    77: 'Snow-Grains',
    80: 'Slight Rain-Showers',
    81: 'Moderate Rain-Showers',
    82: 'Violent Rain-Showers',
    85: 'Slight Snow-Showers',
    86: 'Heavy Snow-Showers',
    95: 'Moderate ThunderStorm',
    96: 'ThunderStorm with Slight Hail',
    99: 'ThunderStorm with Heavy Hail'
};
exports.WeatherResponseSchema = zod_1.z.object({
    current_weather: zod_1.z.object({
        time: zod_1.z.string(),
        is_day: zod_1.z.number(),
        temperature: zod_1.z.number(),
        weathercode: zod_1.z.number(),
        windspeed: zod_1.z.number(),
        winddirection: zod_1.z.number()
    }),
    hourly: zod_1.z.object({
        temperature_2m: zod_1.z.array(zod_1.z.number())
    }),
    hourly_units: zod_1.z.object({
        temperature_2m: zod_1.z.string()
    })
});
;
function forMatTemperature(temperature) {
    return "".concat(temperature.value).concat(temperature.unit);
}
;
;
function forMatWindSpeed(wind) {
    return "".concat(wind.speed).concat(wind.unit);
}
;
var Weather = /** @class */ (function () {
    function Weather(weatherResponse) {
        this.time = weatherResponse.current_weather.time;
        this.dayLight = weatherResponse.current_weather.is_day === 1;
        this.temperature = {
            value: weatherResponse.current_weather.temperature,
            unit: weatherResponse.hourly_units.temperature_2m
        };
        this.hourlyTemperature = weatherResponse.hourly.temperature_2m;
        this.weathercode = weatherResponse.current_weather.weathercode;
        this.wind = {
            speed: weatherResponse.current_weather.windspeed,
            direction: weatherResponse.current_weather.winddirection,
            unit: 'mph'
        };
    }
    ;
    Object.defineProperty(Weather.prototype, "condition", {
        get: function () {
            return weatherCodes[this.weathercode];
        },
        enumerable: false,
        configurable: true
    });
    ;
    Weather.prototype.forMat = function () {
        var descriptionLength = 16;
        var temperature = 'Temperature'.padStart(descriptionLength, '');
        var windSpeed = 'Wind-Speed'.padStart(descriptionLength, '');
        var condition = 'Condition'.padStart(descriptionLength, '');
        var dateTime = 'DateTime'.padStart(descriptionLength, '');
        var forMattedStrings = [
            "".concat(temperature, ": ").concat(forMatTemperature(this.temperature)),
            "".concat(windSpeed, ": ").concat(forMatWindSpeed(this.wind)),
            "".concat(condition, ": ").concat(this.condition),
            "".concat(dateTime, ": ").concat((this.time.replace('T', ' ').replace(/-/g, '/')))
        ];
        return forMattedStrings.join('\n');
    };
    ;
    Object.defineProperty(Weather.prototype, "lowestTemperature", {
        get: function () {
            return this.hourlyTemperature.reduce(function (accumulator, current) { return Math.min(accumulator, current); });
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Weather.prototype, "highestTemperature", {
        get: function () {
            return this.hourlyTemperature.reduce(function (accumulator, current) { return Math.max(accumulator, current); });
        },
        enumerable: false,
        configurable: true
    });
    ;
    return Weather;
}());
exports.Weather = Weather;
;
exports.WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
function weather(fetcher, latitude, longitude) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetcher.request({
                        method: 'GET',
                        url: exports.WEATHER_URL,
                        params: {
                            latitude: latitude,
                            longitude: longitude,
                            current_weather: true,
                            temperature_unit: 'celsius',
                            windspeed_unit: 'mph',
                            hourly: 'temperature_2m',
                            forecast_days: 1
                        }
                    })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200) {
                        try {
                            data = exports.WeatherResponseSchema.parse(response.data);
                            return [2 /*return*/, new Weather(data)];
                        }
                        catch (error) {
                            throw new Error("failed to fetch weather for: ".concat(latitude, ", ").concat(longitude));
                        }
                        ;
                    }
                    else
                        throw new Error('failed to query weather-API');
                    return [2 /*return*/];
            }
        });
    });
}
;
exports.default = weather;
